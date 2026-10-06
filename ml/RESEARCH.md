# StyleMirror AI Specialist — Research

## 1. Objective

The AI Specialist is intended to determine whether clothing is visually compatible, whether an outfit is suitable for a particular person, and eventually provide styling recommendations.

The ML development is divided into:

1. Clothing compatibility
2. Person-aware suitability
3. Styling and recommendation
4. Natural-language explanation

The current work focuses on establishing a reliable clothing compatibility component before adding person-aware analysis.

---

## 2. Dataset

The compatibility dataset is a custom balanced, item-disjoint subset derived from Polyvore.

Final compatibility examples:

* Training: 2,000
* Validation: 500
* Test: 500
* Total: 3,000

The dataset is item-disjoint across train, validation, and test splits.

The manifests are:

```text
ml/data/
├── train.json
├── validation.json
└── test.json
```

The raw images are stored separately and are referenced through item IDs in the manifests.

Dataset preparation is complete and must not be regenerated or rebalanced unless a separate dataset version is explicitly created.

Detailed dataset information is documented in:

```text
ml/data/DATASET_SNAPSHOT.md
```

---

## 3. Initial DINOv2 Experiment

DINOv2 ViT-B/14 was selected as the initial visual representation because it provides strong general-purpose visual features.

Configuration:

* Model: DINOv2 ViT-B/14
* Embedding dimension: 768
* Frozen encoder
* Image representation based on item embeddings

A relationship-based representation was created from clothing embeddings rather than relying only on the average outfit embedding.

### DINOv2 baseline

Validation ROC-AUC:

```text
0.6337
```

A normalized hybrid representation achieved:

```text
ROC-AUC: 0.6383
Accuracy: 0.5900
Precision: 0.5836
Recall: 0.6280
F1: 0.6050
```

Five-fold cross-validation gave approximately:

```text
Mean ROC-AUC: 0.5923
Std: 0.0176
```

DINOv2 was therefore retained as an important baseline but was not selected as the final compatibility representation.

---

## 4. FashionCLIP Experiment

Because the task is specifically fashion compatibility, FashionCLIP was evaluated as a domain-specific visual representation.

Model:

```text
patrickjohncyh/fashion-clip
```

Image embedding dimension:

```text
768
```

The FashionCLIP encoder was kept frozen.

Full embeddings were extracted for all item IDs referenced by the train and validation manifests.

Consolidated embeddings are stored in:

```text
StyleMirror/experiments/fashionclip_full/
```

---

## 5. Selected Compatibility Representation

The main representation uses pairwise relationships between clothing items.

For two item embeddings A and B:

```text
[A, B, |A-B|, A*B]
```

These relationship features are calculated for clothing pairs inside an outfit and then aggregated across the outfit.

Additional relationship statistics were also tested:

* cosine similarity mean
* cosine similarity standard deviation
* cosine similarity minimum
* cosine similarity maximum
* L2 distance mean
* L2 distance standard deviation
* L2 distance minimum
* L2 distance maximum

The final hybrid representation has 3,848 dimensions.

---

## 6. FashionCLIP Results

The FashionCLIP hybrid compatibility model achieved:

```text
Validation ROC-AUC: 0.8027
Accuracy: 0.7080
Precision: 0.7016
Recall: 0.7240
F1: 0.7126
```

Five-fold cross-validation:

```text
Mean ROC-AUC: 0.8074
Standard deviation: 0.0210
Minimum: 0.7727
Maximum: 0.8348
```

The close agreement between holdout validation and cross-validation suggests that the result is reasonably robust for the current dataset.

---

## 7. Ablation Study

Several representations were compared using the same Logistic Regression setup.

| Representation    | Dimensions | ROC-AUC |
| ----------------- | ---------: | ------: |
| Full Hybrid       |       3848 |  0.8028 |
| Pairwise Only     |       3072 |  0.8019 |
| Global + Pairwise |       3840 |  0.7990 |
| Stats Only        |          8 |  0.7827 |
| Global Only       |        768 |  0.4749 |

The main conclusion is that pairwise relationships contain most of the useful information for compatibility prediction.

The global mean embedding alone did not provide a useful compatibility signal on this validation split.

Adding the global mean to pairwise features slightly reduced performance.

Therefore, the simpler pairwise representation is a strong candidate for the production compatibility component.

---

## 8. Pairwise MLP Experiment

A small neural network was tested directly on pairwise FashionCLIP features.

Architecture:

```text
3072
 ↓
512
 ↓
128
 ↓
1
```

Dropout was used between layers.

The model achieved:

```text
Outfit-level ROC-AUC: 0.7750
```

This was below the Logistic Regression result of approximately:

```text
0.8027
```

The result suggests that increasing model complexity does not automatically improve the compatibility task with the current dataset size.

The MLP was therefore not selected.

---

## 9. Current Compatibility Architecture

The current selected architecture is:

```text
Clothing Images
      ↓
FashionCLIP
      ↓
768-D item embeddings
      ↓
Pairwise relationships
[A, B, |A-B|, A*B]
      ↓
Mean aggregation across outfit pairs
      ↓
Logistic Regression
      ↓
Compatibility probability
```

This component should currently remain frozen while the person-aware stage is investigated.

---

## 10. Person-Aware Analysis

The ultimate StyleMirror goal is not only clothing compatibility.

The system should eventually answer:

> Does this clothing suit this particular person?

The current Polyvore compatibility dataset does not contain the required supervised information.

It contains clothing/outfit relationships but does not provide reliable person-photo + clothing-suitability labels.

Therefore, the existing compatibility dataset should not be incorrectly reused as a person-aware training dataset.

### Current plan

Start with a small person-photo pilot.

The pilot will investigate:

```text
Person Photo
     ↓
Person/style visual representation
     ↓
Clothing representation
     ↓
Person × Clothing relationship
     ↓
Suitability analysis
```

The compatibility model will remain frozen during this investigation.

No large person-aware model should be trained until there is evidence that the available person representation contains useful information for the task.

---

## 11. Important Modeling Constraint

The system should analyze visually relevant fashion information without attempting to infer sensitive personal attributes such as race, ethnicity, religion, or other unrelated sensitive characteristics.

The purpose is fashion assistance, not personal profiling.

---

## 12. Next Research Stage

The next stage is:

**Person-aware analysis pilot**

The first experiment should be small and controlled.

Goals:

1. Load a person image.
2. Extract a visual representation.
3. Compare it with clothing representations.
4. Determine whether meaningful person-clothing relationships can be obtained.
5. Only then decide whether additional training or a different model is justified.

No new dataset generation is required at the beginning of this stage.

---

## 13. Research Principle

The project follows an experiment-first approach:

```text
Hypothesis
    ↓
Small experiment
    ↓
Measure result
    ↓
Compare with baseline
    ↓
Keep / reject approach
    ↓
Document decision
```

A more complex model is not adopted unless it demonstrates a measurable improvement.
