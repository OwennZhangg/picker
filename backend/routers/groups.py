from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Court, Group, GroupMember, User
from schemas import GroupCreate, GroupResponse, GroupJoinCreate, GroupJoinResponse

router = APIRouter(prefix="/groups", tags=["groups"])


@router.post("", response_model=GroupResponse)
def create_group(group_data: GroupCreate, db: Session = Depends(get_db)):
    court = db.query(Court).filter(Court.id == group_data.court_id).first()

    if court is None:
        raise HTTPException(status_code=404, detail="Court not found")

    group = Group(
        court_id=group_data.court_id,
        host_name=group_data.host_name,
        starts_in=group_data.starts_in,
        players_needed=group_data.players_needed,
        skill_level=group_data.skill_level,
        tags=group_data.tags,
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    return group


@router.post("/{group_id}/join", response_model=GroupJoinResponse)
def join_group(
    group_id: int,
    join_data: GroupJoinCreate,
    db: Session = Depends(get_db),
):
    group = db.query(Group).filter(Group.id == group_id).first()

    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    user = db.query(User).filter(User.id == join_data.user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    existing_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == join_data.user_id,
        )
        .first()
    )

    if existing_member is not None:
        return existing_member

    active_member = (
        db.query(GroupMember)
        .filter(GroupMember.user_id == join_data.user_id)
        .first()
    )

    if active_member is not None:
        raise HTTPException(
            status_code=409,
            detail="User already has an active group",
        )
    
    if group.players_needed <= 0:
        raise HTTPException(status_code=400, detail="Group is already full")
    
    group.players_needed -=1

    group_member = GroupMember(
        group_id=group_id,
        user_id=join_data.user_id,
    )

    db.add(group_member)
    db.commit()
    db.refresh(group_member)

    return group_member


@router.delete("/{group_id}/join")
def leave_group(
    group_id: int,
    join_data: GroupJoinCreate,
    db: Session = Depends(get_db),
):
    group_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == join_data.user_id,
        )
        .first()
    )

    if group_member is None:
        raise HTTPException(status_code=404, detail="Group membership not found")

    group = db.query(Group).filter(Group.id == group_id).first()

    if group is not None:
        group.players_needed += 1

    db.delete(group_member)
    db.commit()

    return {"message": "Left group"}