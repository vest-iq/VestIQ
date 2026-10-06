# StyleMirror AI Specialist — Experiment Log

This document records meaningful ML experiments and their decisions.

---

## Experiment 001 — DINOv2 Compatibility Baseline

### Objective

Test whether general-purpose DINOv2 visual embeddings can represent clothing compatibility.

### Model

DINOv2 ViT-B/14

### Embedding

768-dimensional frozen image embeddings.

### Dataset

* Train: 2,000 compatibility examples
* Validation: 500 compatibility examples
* Test: 500 compatibility examples
* Item-disjoint splits

### Result

```text
ROC-AUC: 0.6337
Accuracy: 0.5840
Precision: 0.5795
Recall: 0.6120
F1: 0.5953
```

### Decision

Keep as a baseline.

Do not use as the primary compatibility representation because a fashion-specific representation is expected to be more appropriate.

---

## Experiment 002 — DINOv2 Hybrid Relationship Representation

### Objective

Test whether explicit relationships between clothing items improve compatibility prediction.

### Representation

```text
Global mean
+
[A, B, |A-B|, A*B]
+
Cosine statistics
+
L2 statistics
```

### Result

```text
ROC-AUC: 0.6383
Accuracy: 0.5900
Precision: 0.5836
Recall: 0.6280
F1: 0.6050
```

### Decision

Relationship features are useful, but the overall result is limited.

Proceed to a fashion-specific visual encoder.

---

## Experiment 003 — DINOv2 Five-Fold Cross Validation

### Objective

Check robustness of the DINOv2 compatibility result.

### Result

```text
Mean ROC-AUC: 0.5923
Std: 0.0176
```

### Decision

DINOv2 remains a useful baseline but is not selected.

---

## Experiment 004 — FashionCLIP Compatibility

### Objective

Test a fashion-domain visual encoder.

### Model

FashionCLIP:

```text
patrickjohncyh/fashion-clip
```

### Representation

Pairwise relationship features:

```text
[A, B, |A-B|, A*B]
```

plus relationship statistics.

### Validation Result

```text
ROC-AUC: 0.8027
Accuracy: 0.7080
Precision: 0.7016
Recall: 0.7240
F1: 0.7126
```

### Five-Fold Cross Validation

```text
Mean ROC-AUC: 0.8074
Std: 0.0210
```

### Decision

**Selected as the current compatibility architecture.**

---

## Experiment 005 — Pairwise MLP

### Objective

Test whether a small neural network can learn compatibility relationships better than Logistic Regression.

### Architecture

```text
3072 → 512 → 128 → 1
```

### Result

```text
Outfit-level ROC-AUC: 0.7750
```

### Decision

Not selected.

The more complex neural model performed below the simpler Logistic Regression model.

---

## Experiment 006 — Feature Ablation

### Objective

Determine which FashionCLIP feature components contribute most to compatibility prediction.

### Results

| Feature Set       | Dimensions | ROC-AUC |
| ----------------- | ---------: | ------: |
| Full Hybrid       |       3848 |  0.8028 |
| Pairwise Only     |       3072 |  0.8019 |
| Global + Pairwise |       3840 |  0.7990 |
| Stats Only        |          8 |  0.7827 |
| Global Only       |        768 |  0.4749 |

### Decision

Pairwise relationships contain most of the useful compatibility signal.

The global mean feature is not necessary and slightly hurts performance when added to pairwise features.

The current architecture can therefore be simplified around pairwise relationships.

---

## Current Decision

The compatibility component is considered sufficiently investigated for the current project stage.

Current architecture:

```text
FashionCLIP
    ↓
768-D item embeddings
    ↓
Pairwise relationship features
    ↓
Aggregation
    ↓
Logistic Regression
    ↓
Compatibility score
```

Do not perform additional architecture experiments unless a specific hypothesis is identified.

---

## Next Experiment — Person-Aware Pilot

### Objective

Investigate whether a person's image can provide useful visual information for clothing suitability.

### Important limitation

The current Polyvore dataset does not contain person-photo + clothing-suitability labels.

Therefore, supervised person-aware training is not justified yet.

### Planned approach

```text
Person Photo
      ↓
Person representation
      ↓
Clothing representation
      ↓
Person × Clothing relationship
      ↓
Suitability analysis
```

The existing compatibility model remains frozen.

### Success criterion

Determine whether the person representation provides useful information before investing in a larger model or new dataset.

### Status

**NEXT**
