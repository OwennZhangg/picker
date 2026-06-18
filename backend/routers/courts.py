from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Court, Group
from schemas import CourtResponse, GroupResponse

router = APIRouter(prefix="/courts", tags=["courts"])


@router.get("", response_model=list[CourtResponse])
def get_courts(db: Session = Depends(get_db)):
    courts = db.query(Court).all()
    return courts


# groups stuff


@router.get("/{court_id}/groups", response_model=list[GroupResponse])
def get_court_groups(court_id: str, db: Session = Depends(get_db)):
    court = db.query(Court).filter(Court.id == court_id).first()

    if court is None:
        raise HTTPException(status_code=404, detail="Court not found")

    groups = db.query(Group).filter(Group.court_id == court_id).all()
    return groups


@router.get("/{court_id}", response_model=CourtResponse)
def get_court(court_id: str, db: Session = Depends(get_db)):
    court = db.query(Court).filter(Court.id == court_id).first()

    if court is None:
        raise HTTPException(status_code=404, detail="Court not found")

    return court
