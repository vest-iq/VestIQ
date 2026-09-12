from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer

from app.core.supabase import supabase
from app.core.auth import get_current_user
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    RefreshRequest
)

from app.core.rate_limit import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

security = HTTPBearer()


@router.get("/test")
def auth_test():
    return {
        "message": "Supabase Auth client is connected"
    }


@router.post("/signup")
@limiter.limit("5/minute")
def signup(request: Request, data: SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {
                    "first_name": data.first_name,
                    "last_name": data.last_name
                }
            }
        })

        if not response.user:
            raise HTTPException(
                status_code=400,
                detail="Signup failed"
            )

        return {
            "message": "Signup successful",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "first_name": response.user.user_metadata.get("first_name"),
                "last_name": response.user.user_metadata.get("last_name")
            }
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Signup failed"
        )


@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if not response.user or not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "first_name": response.user.user_metadata.get("first_name"),
                "last_name": response.user.user_metadata.get("last_name")
            }
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

@router.post("/refresh")
@limiter.limit("20/minute")
def refresh_token(request: Request, data: RefreshRequest):
    try:
        response = supabase.auth.refresh_session(
            data.refresh_token
        )

        if not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        return {
            "message": "Token refreshed",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )

@router.get("/me")
def get_me(claims=Depends(get_current_user)):
    return {
        "id": claims.get("sub"),
        "email": claims.get("email"),
        "role": claims.get("role")
    }


@router.post("/logout")
def logout(
    claims=Depends(get_current_user)
):
    return {
        "message": "Logout successful",
        "user_id": claims.get("sub")
    }