from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    first_name: str = Field(
        min_length=1,
        max_length=50
    )

    last_name: Optional[str] = Field(
        default=None,
        max_length=50
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=72
    )


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=72
    )

class RefreshRequest(BaseModel):
    refresh_token: str = Field(
        min_length=1,
        max_length=2048
    )