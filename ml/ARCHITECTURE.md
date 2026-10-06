# StyleMirror AI Specialist — ML Architecture

## Current Architecture

The AI Specialist is being developed as multiple components rather than one large end-to-end model.

```text
                    AI SPECIALIST
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
   Compatibility    Person-Aware     Styling /
      Engine         Analysis      Recommendation
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                Natural Language
                  Explanation
```

---

# 1. Compatibility Engine

## Purpose

Determine whether clothing items in an outfit are visually compatible.

## Current Model

FashionCLIP is used as a frozen visual encoder.

```text
Clothing Image
      ↓
FashionCLIP
      ↓
768-D embedding
```

For clothing items A and B:

```text
[A, B, |A-B|, A*B]
```

These pairwise relationships are aggregated across the outfit.

A Logistic Regression classifier produces the compatibility probability.

## Current Performance

Validation:

```text
ROC-AUC ≈ 0.8027
```

Five-fold CV:

```text
ROC-AUC = 0.8074 ± 0.0210
```

## Status

**Selected / frozen for the current development stage.**

---

# 2. Person-Aware Analysis

## Purpose

Determine whether clothing is suitable for a particular person.

This is different from clothing compatibility.

Compatibility asks:

```text
Do these clothes work together?
```

Person-aware analysis asks:

```text
Do these clothes work for this person?
```

## Current Status

Research stage.

The current Polyvore compatibility dataset does not contain the required person-photo + clothing-suitability labels.

Therefore, the current compatibility model will not be incorrectly trained to perform person-aware suitability.

## Planned Architecture

```text
Person Photo
      ↓
Person / Style Representation
      │
      ├──────────────┐
      │              │
      ▼              ▼
Person features   Clothing embedding
                       │
                       ▼
              Person × Clothing
                 relationship
                       │
                       ▼
                Suitability
                  analysis
```

The first stage will be a small pilot experiment rather than a large training run.

---

# 3. Styling / Recommendation

## Purpose

Generate recommendations such as:

* outfit combinations
* color combinations
* accessories
* styling suggestions
* alternative clothing combinations

## Status

Not implemented yet.

---

# 4. Natural Language Explanation

## Purpose

Convert model outputs into understandable user-facing explanations.

Example output structure:

```text
Suitability
Why it works
What could be improved
Suggested pairing
Suggested accessories
```

A VLM/LLM may be used here after the underlying visual analysis is established.

## Status

Future stage.

---

# 5. Production Flow

The eventual AI Specialist flow is expected to be:

```text
User Photo
     │
     ├───────────────┐
     │               │
     ▼               ▼
Person Analysis   Clothing Image
                     │
                     ▼
                FashionCLIP
                     │
                     ▼
              Clothing Features
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Compatibility          Person-Aware
      Engine                 Analysis
          │                     │
          └──────────┬──────────┘
                     ▼
             Styling Logic
                     │
                     ▼
             Explanation
                     │
                     ▼
               API Response
```

---

# 6. Development Principle

Models should be added only when experiments demonstrate that they provide useful information.

The project should prefer:

```text
Simple validated model
        >
Complex unvalidated model
```

The current compatibility architecture is therefore kept frozen while research moves to person-aware analysis.
