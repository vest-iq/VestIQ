
from pydantic import BaseModel, ConfigDict, Field


class ProfileResponse(BaseModel):
    id: str
    first_name: str | None = None
    last_name: str | None = None
    avatar_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    avatar_url: str | None = Field(default=None, max_length=2048)
