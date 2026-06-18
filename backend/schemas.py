from pydantic import BaseModel


class CourtResponse(BaseModel):
    id: str
    name: str
    active_players: int
    distance: str | None = None
    image_url: str | None = None
    tags: list[str] = []

    model_config = {"from_attributes": True}


class GroupCreate(BaseModel):
    court_id: str
    host_name: str
    starts_in: str
    players_needed: int
    skill_level: str
    tags: list[str] = []


class GroupResponse(BaseModel):
    id: int
    court_id: str
    host_name: str
    starts_in: str
    players_needed: int
    skill_level: str
    tags: list[str] = []

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    display_name: str
    avatar_url: str | None = None


class UserResponse(BaseModel):
    id: int
    display_name: str
    avatar_url: str | None = None

    model_config = {"from_attributes": True}


class GroupJoinCreate(BaseModel):
    user_id: int


class GroupJoinResponse(BaseModel):
    id: int
    group_id: int
    user_id: int

    model_config = {"from_attributes": True}
