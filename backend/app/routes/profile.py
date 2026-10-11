
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from supabase import create_client

from app.core.auth import get_current_user, security
from app.core.config import SUPABASE_URL, SUPABASE_KEY
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/profile", tags=["Profile"])


def get_user_supabase_client(token: str):
    """Create a Supabase client scoped to the authenticated user's JWT."""
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    client.postgrest.auth(token)
    return client


def get_auth_metadata(client, token: str) -> dict:
    """Read the existing user's signup metadata without changing auth routes."""
    try:
        response = client.auth.get_user(token)
        user = response.user
        return user.user_metadata or {} if user else {}
    except Exception:
        return {}


@router.get("/me", response_model=ProfileResponse)
def get_profile(
    claims=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = claims["sub"]
    client = get_user_supabase_client(credentials.credentials)

    try:
        result = (
            client.table("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if result.data:
            return result.data[0]

        # Signup remains unchanged. Use existing Auth metadata until
        # the user saves their profile for the first time.
        metadata = get_auth_metadata(client, credentials.credentials)

        return {
            "id": user_id,
            "first_name": metadata.get("first_name"),
            "last_name": metadata.get("last_name"),
            "avatar_url": None,
        }

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[PROFILE ERROR] {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=503,
            detail="Profile service is temporarily unavailable.",
        )


@router.patch("/me", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    claims=Depends(get_current_user),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = claims["sub"]
    client = get_user_supabase_client(credentials.credentials)

    updates = payload.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one profile field to update.",
        )

    try:
        # Preserve existing values for fields omitted from the request.
        existing = (
            client.table("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if existing.data:
            current = existing.data[0]
        else:
            metadata = get_auth_metadata(client, credentials.credentials)
            current = {
                "id": user_id,
                "first_name": metadata.get("first_name"),
                "last_name": metadata.get("last_name"),
                "avatar_url": None,
            }

        profile_data = {**current, **updates, "id": user_id}

        result = (
            client.table("profiles")
            .upsert(profile_data, on_conflict="id")
            .execute()
        )

        if result.data:
            return result.data[0]

        # Fetch the saved row if the database did not return it.
        saved = (
            client.table("profiles")
            .select("id, first_name, last_name, avatar_url")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if saved.data:
            return saved.data[0]

        raise HTTPException(
            status_code=500,
            detail="Profile was not returned after saving.",
        )

    except HTTPException:
        raise
    except Exception as exc:
        print(f"[PROFILE ERROR] {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=503,
            detail="Profile service is temporarily unavailable.",
        )
