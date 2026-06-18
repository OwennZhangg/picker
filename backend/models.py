from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY

from database import Base


class Court(Base):
    __tablename__ = "courts"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    active_players = Column(Integer, default=0)
    distance = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    tags = Column(ARRAY(String), default=[])


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(String, ForeignKey("courts.id"), nullable=False)
    host_name = Column(String, nullable=False)
    starts_in = Column(String, nullable=False)
    players_needed = Column(Integer, nullable=False)
    skill_level = Column(String, nullable=False)
    tags = Column(ARRAY(String), default=[])


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)

    