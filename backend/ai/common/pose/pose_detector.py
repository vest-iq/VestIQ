from pathlib import Path

import mediapipe as mp
import numpy as np


class PoseDetector:
    def __init__(
        self,
        model_path: str,
        num_poses: int = 1,
        min_detection_confidence: float = 0.5,
        min_presence_confidence: float = 0.5,
        min_tracking_confidence: float = 0.5,
    ):
        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Pose model not found: {self.model_path}"
            )

        base_options = mp.tasks.BaseOptions(
            model_asset_path=str(self.model_path)
        )

        options = mp.tasks.vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=mp.tasks.vision.RunningMode.IMAGE,
            num_poses=num_poses,
            min_pose_detection_confidence=min_detection_confidence,
            min_pose_presence_confidence=min_presence_confidence,
            min_tracking_confidence=min_tracking_confidence,
            output_segmentation_masks=False,
        )

        self.detector = (
            mp.tasks.vision.PoseLandmarker.create_from_options(
                options
            )
        )

    def detect(self, image):
        """
        Detect human pose from a PIL RGB image.
        """

        image_array = np.asarray(image)

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=image_array,
        )

        return self.detector.detect(mp_image)

    def close(self):
        """Release MediaPipe resources."""
        self.detector.close()