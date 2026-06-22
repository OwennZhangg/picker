from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Group, GroupMember, User
from schemas import GroupResponse, UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = User(
        display_name=user_data.display_name,
        avatar_url=user_data.avatar_url,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="user not found")

    return user


@router.get("/{user_id}/active-group", response_model=GroupResponse | None)
def get_active_group(user_id: int, db: Session = Depends(get_db)):
    group_member = (
        db.query(GroupMember)
        .filter(GroupMember.user_id == user_id)
        .first()
    )

    if group_member is None:
        return None

    return db.query(Group).filter(Group.id == group_member.group_id).first()
