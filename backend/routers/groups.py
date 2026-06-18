from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Court, Group
from schemas import GroupCreate, GroupResponse

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



