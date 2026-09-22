# StyleMirror AI Specialist — Dataset Snapshot

## 1. Dataset Purpose

This dataset is used to train and evaluate the StyleMirror AI Specialist's fashion compatibility model.

The task is to learn visual compatibility relationships between fashion items/outfits and later support personalized fashion recommendations.

---

## 2. Dataset Source

**Source:** Polyvore-derived fashion compatibility dataset.

The dataset was selected and prepared specifically for the StyleMirror AI Specialist project.

The final dataset is a custom, balanced subset prepared for experimentation and evaluation.

---

## 3. Final Dataset Size

| Split      |    Samples |
| ---------- | ---------: |
| Train      |      9,926 |
| Validation |      2,490 |
| Test       |      2,434 |
| **Total**  | **14,850** |

---

## 4. Dataset Splits

The final manifests are:

```text
train.json
validation.json
test.json
```

These manifests define the final train, validation, and test samples.

The splits are **item-disjoint**, meaning items are not shared across the corresponding dataset partitions in a way that would cause the same fashion item to appear across splits.

This is intended to reduce data leakage and provide a more meaningful evaluation of generalization to unseen items.

---

## 5. Label / Learning Objective

The primary objective is fashion compatibility prediction.

The model will learn whether fashion items/outfit combinations are visually compatible.

The initial implementation will treat this as a compatibility classification problem.

Later experiments may extend this into:

* Pairwise compatibility
* Outfit-level compatibility
* Retrieval and ranking
* Personalized recommendations
* Person-aware fashion compatibility

---

## 6. Initial ML Approach

The first baseline will use a pretrained visual encoder:

**DINOv2**

Initial strategy:

```text
Image
  ↓
DINOv2
  ↓
Visual embedding
  ↓
Compatibility model
  ↓
Compatibility probability
```

DINOv2 will initially remain **frozen**.

Fine-tuning will only be considered after establishing a reliable baseline.

---

## 7. Data Processing Policy

The finalized dataset must be treated as immutable for the initial experiments.

Do not:

* Regenerate the dataset
* Change the train/validation/test split
* Randomly reshuffle samples into new splits
* Add new images to the existing evaluation dataset
* Remove samples based on model performance
* Modify labels without recording a new dataset version

Any future dataset modification must create a new documented dataset version.

---

## 8. Storage

The dataset is stored outside GitHub because of its size.

Experimental storage:

```text
Google Drive
└── StyleMirror/
    └── dataset/
        ├── raw/
        │   ├── train/
        │   ├── validation/
        │   └── test/
        │
        └── processed/
            ├── train.json
            ├── validation.json
            └── test.json
```

The actual dataset files are **not committed to GitHub**.

---

## 9. Reproducibility

The following should remain consistent throughout the baseline experiments:

* Dataset source
* Dataset subset
* Dataset size
* Dataset manifests
* Train/validation/test assignment
* Item-disjoint property
* Label definition

Experiments should record:

* Model/encoder version
* Hyperparameters
* Random seed
* Dataset version
* Evaluation metrics
* Checkpoint/version information

MLflow will later be used for experiment tracking.

---

## 10. Known Limitations

This dataset represents a selected subset of fashion data and should not be interpreted as a complete representation of real-world fashion preferences.

Visual compatibility learned from the dataset does not automatically imply:

* Personal preference
* Body/fit suitability
* Cultural appropriateness
* Occasion suitability
* Current fashion trends
* Individual style preferences

These factors will be addressed separately in later components of StyleMirror.

---

## 11. Dataset Version

**Version:** `v1.0`

**Status:** Finalized for baseline experimentation.

**Important:** The dataset preparation phase is complete. Future model experiments should use this version unless a new dataset version is explicitly created and documented.
