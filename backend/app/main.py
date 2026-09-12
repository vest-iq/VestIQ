from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.routes.auth import router as auth_router
from app.core.rate_limit import limiter


app = FastAPI(title="StyleMirror API")


# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "StyleMirror API is running"
    }