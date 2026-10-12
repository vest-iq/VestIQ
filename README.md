  # VestIQ --- AI-Powered Personal Fashion Assistant

VestIQ (formerly referred to as StyleMirror) is an AI-powered fashion
assistant designed to help users discover clothing, understand how items
may suit them, and get practical styling guidance through a modern,
responsive web experience.

> **Project status:** Under active development. Some features and
> integrations are still being validated. This README distinguishes the
> current project direction from functionality that may not yet be
> production-ready.

## Highlights

-   **Smart Discovery / Product Finder:** Search for visually similar
    clothing products from an uploaded clothing image using Google Lens
    results through SerpApi.
-   **AI Stylist / AI Specialist:** Analyze clothing and provide outfit
    suitability and styling guidance. The visual compatibility research
    uses frozen FashionCLIP embeddings and pairwise item-relationship
    features.
-   **Styling explanations:** A planned/experimental text-explanation
    layer uses a Groq-hosted Qwen model to turn structured
    visual-analysis results into natural-language guidance.
-   **Authentication:** FastAPI backend with Supabase Auth integration.
-   **Responsive interface:** Next.js, React, and TypeScript frontend
    with a dark navy, glassmorphism-inspired visual design.
-   **API-first backend:** FastAPI services with request validation and
    rate limiting.

**Virtual Try-On is not part of the current feature scope.**

## Tech Stack

### Frontend

-   Next.js (App Router)
-   React
-   TypeScript
-   Redux Toolkit and React Redux for application state
-   Tailwind CSS / utility-first styling
-   Motion (`motion/react`) for interface animation
-   Lucide React for icons

### Backend

-   Python 3.10
-   FastAPI
-   Uvicorn
-   Pydantic
-   Supabase Auth and hosted Postgres
-   SlowAPI for rate limiting
-   HTTPX and Beautiful Soup for HTTP requests and HTML parsing
-   Pillow and `python-multipart` for image handling and uploads

### AI / Machine Learning

-   FashionCLIP for fashion-image embeddings
-   PyTorch for model experimentation and inference
-   Scikit-learn / Logistic Regression for compatibility classification
    experiments
-   Pairwise item features: `[A, B, |A-B|, A*B]`
-   Groq API with a Qwen model for an experimental text explanation
    layer
-   Google Colab GPU for model experiments and feature extraction

### External Services and Tools

-   SerpApi Google Lens for visual product search
-   Supabase for authentication and hosted database services
-   Git and GitHub for version control
-   VS Code for development
-   Google Drive for dataset and experiment artifacts

## Architecture Overview

``` text
Next.js + React + TypeScript
            |
            | API requests
            v
       FastAPI backend
        /     |      \
       /      |       \
 Supabase  Product    AI Stylist
  Auth     Finder     services
             |            |
          SerpApi    FashionCLIP
          Google     embeddings /
           Lens      compatibility
                         |
                  Optional text
                  explanation layer
                  (Groq + Qwen)
```

The frontend communicates with the backend through API requests. Secrets
such as API keys should remain in environment variables and must never
be committed to Git.

## Machine-Learning Approach

The current outfit-compatibility research direction uses:

1.  **Frozen FashionCLIP embeddings** to represent fashion items.
2.  **Pairwise relationship features** between items: each pair is
    represented using the two embeddings, their absolute difference, and
    element-wise product.
3.  **Pair aggregation** to represent relationships across an outfit.
4.  **Logistic Regression** to classify outfit compatibility.

In experiments on the current Polyvore-derived dataset, the selected
approach reached approximately **0.803 validation ROC-AUC** and **0.807
mean five-fold cross-validation ROC-AUC**. These are experimental
dataset results, not a guarantee of real-world styling accuracy. The
current compatibility dataset does not itself provide the
person-photo-plus-clothing context needed for full person-aware
analysis.

## Repository Layout

The exact layout may evolve as development continues. The intended
separation is:

``` text
VestIQ/
├── frontend/          # Next.js web application
├── backend/           # FastAPI API and services
└── ml/                # ML experiments, training and inference
    ├── configs/
    ├── data/
    ├── evaluations/
    ├── inferences/
    ├── models/
    ├── notebooks/
    ├── preprocessing/
    └── training/
```

Keep model training and experimentation separate from the API
implementation. Integrate validated inference code into the backend only
after testing it independently.

## Getting Started

### Prerequisites

-   Node.js and npm
-   Python 3.10
-   Git
-   Supabase project credentials
-   SerpApi key for visual product search
-   Groq API key only if using the experimental explanation layer

### 1. Clone the repository

``` bash
git clone https://github.com/vest-iq/VestIQ.git
cd VestIQ
```

### 2. Frontend

From the frontend directory:

``` bash
npm install
npm run dev
```

The Next.js development server commonly runs at `http://localhost:3000`.
Use the scripts defined in `package.json` if they differ.

### 3. Backend

Create and activate a Python 3.10 virtual environment in the backend
directory, then install the project's declared dependencies. For
example:

``` bash
python -m venv .venv
```

Windows PowerShell:

``` powershell
.venv\Scripts\Activate.ps1
```

Install dependencies using the repository's dependency file and run the
FastAPI application using the actual entry-point module configured in
the project. For example, if the entry point is `app.main:app`:

``` bash
uvicorn app.main:app --reload
```

The precise install and run commands depend on the current
`package.json` and backend dependency configuration.

### 4. Environment variables

Create a local `.env` file where the backend expects it. Example
variable names:

``` env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SERPAPI_KEY=your_serpapi_key
GROQ_API_KEY=your_groq_api_key
```

Only configure keys for services you use. Do not commit `.env` files or
real secrets. Add environment files, virtual environments, caches,
datasets, and large model checkpoints to `.gitignore` as appropriate.

## Skills Demonstrated

-   **Frontend development:** React, Next.js App Router, TypeScript,
    responsive UI design, reusable components, animation, icon
    libraries.
-   **State management:** Redux Toolkit, React Redux, async
    request/state handling patterns.
-   **Backend development:** Python, FastAPI, REST API design, Pydantic
    validation, image-upload handling, rate limiting.
-   **Authentication and data services:** Supabase Auth integration and
    hosted Postgres concepts.
-   **Applied machine learning:** image embeddings, transfer learning
    with frozen pretrained encoders, feature engineering, pairwise
    compatibility modeling, Logistic Regression.
-   **Model evaluation:** ROC-AUC, cross-validation, validation-set
    evaluation, baseline comparison.
-   **AI integration:** API-based LLM integration, structured outputs,
    prompt constraints, graceful handling of external-service failures.
-   **Visual search integration:** SerpApi Google Lens and
    product-result handling.
-   **Data and experimentation:** dataset manifests, image
    preprocessing, feature extraction, Google Colab GPU workflows,
    Google Drive artifact management.
-   **Engineering practices:** modular architecture, environment-based
    configuration, Git/GitHub, incremental testing, separation of
    frontend, backend, and ML work.

## Current Scope and Limitations

-   Product results depend on the external visual-search provider and
    may contain irrelevant matches.
-   Product prices and metadata should be treated as unavailable unless
    they are successfully retrieved and validated.
-   The Groq/Qwen explanation layer is experimental and should be
    verified end-to-end before being described as production-ready.
-   Compatibility metrics come from a specific dataset and evaluation
    setup; they do not establish universal fashion judgment.
-   Person-aware recommendations and production-grade personalization
    require further validation.
-   Virtual Try-On is excluded from the current scope.

## Roadmap

-   Improve visual product-result filtering, deduplication, and metadata
    quality.
-   Validate AI Stylist end-to-end with robust error handling.
-   Add person-aware analysis supported by an appropriate dataset and
    evaluation protocol.
-   Improve automated tests, API documentation, and deployment
    configuration.
-   Polish responsive UI, loading states, empty states, and error
    feedback.
-   Deploy the frontend and backend with secure environment
    configuration.

## Contributing

This is an actively developed project. Before making changes, inspect
the current repository structure and existing implementation rather than
replacing working files blindly. Keep secrets out of source control and
test changes feature by feature.

## License

This project is licensed under the **MIT License**. See the
[LICENSE](LICENSE) file for details.
