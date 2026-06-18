from database import SessionLocal
from models import Court, Group

db = SessionLocal()

courts = [
    Court(
        id="walnut-grove",
        name="Walnut Grove",
        active_players=22,
        distance="0.8 km",
        image_url=None,
        tags=["Music", "Casual"],
    ),
    Court(
        id="hub-center",
        name="The Hub Center",
        active_players=14,
        distance="2.1 km",
        image_url=None,
        tags=["Competitive"],
    ),
    Court(
        id="sunset-ridge",
        name="Sunset Ridge",
        active_players=8,
        distance="3.4 km",
        image_url=None,
        tags=["Social", "Sunset Play"],
    ),
]

groups = [
    Group(
        court_id="walnut-grove",
        host_name="Owen",
        starts_in="Starting now",
        players_needed=2,
        skill_level="Intermediate",
        tags=["Casual", "Music", "Drinks after"],
    ),
    Group(
        court_id="walnut-grove",
        host_name="Sarah",
        starts_in="In 15 mins",
        players_needed=1,
        skill_level="Competitive",
        tags=["Competitive", "Drills"],
    ),
    Group(
        court_id="sunset-ridge",
        host_name="Maya",
        starts_in="In 30 mins",
        players_needed=3,
        skill_level="Beginner",
        tags=["Social", "Beginner Friendly"],
    ),
]


db.add_all(courts)
db.add_all(groups)
db.commit()
db.close()

print("Seeded courts")
