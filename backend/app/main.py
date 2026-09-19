from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.routes.auth import router as auth_router
from app.core.rate_limit import limiter

from app.services.dependencies import get_valid_image
from app.services.image.processor import process_image

from app.routes.product_finder import router as product_finder_router


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
app.include_router(product_finder_router)

@app.get("/")
def root():
    return {
        "message": "StyleMirror API is running"
    }
    
@app.post("/test/image")
async def test_image(
    image_bytes: bytes = Depends(get_valid_image),
):
    processed_image = process_image(image_bytes)

    return {
        "message": "Image processed successfully",
        "original_size_bytes": len(image_bytes),
        "processed_width": processed_image.width,
        "processed_height": processed_image.height,
        "processed_mode": processed_image.mode,
    }