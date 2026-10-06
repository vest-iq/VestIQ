from __future__ import annotations

from pathlib import Path
from typing import Sequence

import joblib
import numpy as np


EMBEDDING_DIM = 768
FEATURE_DIM = 3848

DEFAULT_MODEL_PATH = (
    Path(__file__).resolve()
    .parents[4]
    / "ml"
    / "models"
    / "compatibility_model.joblib"
)


class CompatibilityService:
    """
    Production inference service for the trained FashionCLIP
    compatibility model.

    The trained model expects an outfit-level representation:

        768  global mean
        +
        3072 pairwise relationship features
        +
        4 cosine statistics
        +
        4 L2 statistics
        =
        3848 features

    Important:
    The model was trained on multi-item Polyvore outfits.
    A two-image production input therefore represents a distribution
    shift and should be treated as a compatibility signal rather than
    a calibrated probability of personal suitability.
    """

    def __init__(
        self,
        model_path: str | Path = DEFAULT_MODEL_PATH,
    ) -> None:
        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Compatibility model not found: "
                f"{self.model_path}"
            )

        self.model = joblib.load(self.model_path)

    @staticmethod
    def _validate_embeddings(
        embeddings: Sequence[np.ndarray],
    ) -> np.ndarray:
        """
        Validate and convert embeddings to a 2D float32 array.

        Expected shape:

            [number_of_items, 768]
        """

        if not embeddings:
            raise ValueError(
                "At least two embeddings are required."
            )

        array = np.asarray(embeddings, dtype=np.float32)

        if array.ndim != 2:
            raise ValueError(
                "Embeddings must be a 2D array with shape "
                f"(n_items, {EMBEDDING_DIM}). "
                f"Received shape: {array.shape}"
            )

        if array.shape[1] != EMBEDDING_DIM:
            raise ValueError(
                f"Expected embedding dimension "
                f"{EMBEDDING_DIM}, got {array.shape[1]}."
            )

        if array.shape[0] < 2:
            raise ValueError(
                "At least two item embeddings are required "
                "to construct pairwise compatibility features."
            )

        if not np.isfinite(array).all():
            raise ValueError(
                "Embeddings contain NaN or infinite values."
            )

        return array

    @staticmethod
    def _normalize_embeddings(
        embeddings: np.ndarray,
    ) -> np.ndarray:
        """
        L2-normalize each item embedding.

        This matches the representation used during training.
        """

        norms = np.linalg.norm(
            embeddings,
            axis=1,
            keepdims=True,
        )

        if np.any(norms == 0):
            raise ValueError(
                "Cannot normalize an embedding with zero norm."
            )

        return embeddings / norms

    @staticmethod
    def _build_features(
        embeddings: np.ndarray,
    ) -> np.ndarray:
        """
        Build the exact 3848-dimensional representation used
        to train the production compatibility model.
        """

        normalized = CompatibilityService._normalize_embeddings(
            embeddings
        )

        # --------------------------------------------------------
        # 1. Global mean
        # --------------------------------------------------------

        global_mean = normalized.mean(axis=0)

        # --------------------------------------------------------
        # 2. Pairwise relationship features
        #
        # For every i < j:
        #
        # [A, B, |A-B|, A*B]
        #
        # Each pair = 3072 dimensions.
        # --------------------------------------------------------

        pair_features = []
        cosine_values = []
        l2_values = []

        number_of_items = normalized.shape[0]

        for i in range(number_of_items):
            for j in range(i + 1, number_of_items):
                a = normalized[i]
                b = normalized[j]

                pair = np.concatenate(
                    [
                        a,
                        b,
                        np.abs(a - b),
                        a * b,
                    ]
                )

                pair_features.append(pair)

                cosine = float(np.dot(a, b))
                l2_distance = float(np.linalg.norm(a - b))

                cosine_values.append(cosine)
                l2_values.append(l2_distance)

        pairwise_mean = np.mean(
            np.asarray(pair_features, dtype=np.float32),
            axis=0,
        )

        # --------------------------------------------------------
        # 3. Cosine statistics
        #
        # mean, std, min, max
        # --------------------------------------------------------

        cosine_values = np.asarray(
            cosine_values,
            dtype=np.float32,
        )

        cosine_stats = np.asarray(
            [
                cosine_values.mean(),
                cosine_values.std(),
                cosine_values.min(),
                cosine_values.max(),
            ],
            dtype=np.float32,
        )

        # --------------------------------------------------------
        # 4. L2 statistics
        #
        # mean, std, min, max
        # --------------------------------------------------------

        l2_values = np.asarray(
            l2_values,
            dtype=np.float32,
        )

        l2_stats = np.asarray(
            [
                l2_values.mean(),
                l2_values.std(),
                l2_values.min(),
                l2_values.max(),
            ],
            dtype=np.float32,
        )

        # --------------------------------------------------------
        # Final representation
        #
        # 768 + 3072 + 4 + 4 = 3848
        # --------------------------------------------------------

        features = np.concatenate(
            [
                global_mean,
                pairwise_mean,
                cosine_stats,
                l2_stats,
            ]
        )

        if features.shape != (FEATURE_DIM,):
            raise RuntimeError(
                "Unexpected compatibility feature dimension: "
                f"{features.shape}. "
                f"Expected ({FEATURE_DIM},)."
            )

        if not np.isfinite(features).all():
            raise RuntimeError(
                "Compatibility features contain NaN "
                "or infinite values."
            )

        return features.astype(np.float32)

    def predict(
        self,
        embeddings: Sequence[np.ndarray],
    ) -> dict:
        """
        Generate a compatibility signal from item embeddings.

        Returns a structured result suitable for the orchestrator/API.
        """

        embeddings_array = self._validate_embeddings(
            embeddings
        )

        features = self._build_features(
            embeddings_array
        )

        feature_batch = features.reshape(1, -1)

        # Pipeline contains:
        # StandardScaler + LogisticRegression
        probability = float(
            self.model.predict_proba(feature_batch)[0, 1]
        )

        prediction = int(
            self.model.predict(feature_batch)[0]
        )

        return {
            "prediction": prediction,
            "score": probability,
            "feature_dimension": int(features.shape[0]),
            "num_items": int(embeddings_array.shape[0]),
        }


# Singleton used by the backend.
compatibility_service = CompatibilityService()