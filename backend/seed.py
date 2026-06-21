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
    )
]

groups = [
    Group(
        court_id="walnut-grove",
        host_name="David",
        starts_in="Starting now",
        players_needed=4,
        skill_level="Intermediate",
        tags=["Casual", "Music", "Drinks after"],
    )
]


db.add_all(courts)
db.add_all(groups)
db.commit()
db.close()

print("Seeded courts")
