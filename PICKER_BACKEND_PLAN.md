# Picker Backend MVP Plan

## Overview

Connect the existing Expo frontend to a real FastAPI + PostgreSQL backend.
No auth. No deployment yet. Just get real data flowing to the phone.

---

## Stack

| Layer | Tool |
|---|---|
| API | FastAPI + Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Server | Uvicorn |
| Phone connection | Local IP (same WiFi) |

---

## Folder Structure

```
picker-backend/
  main.py            ← FastAPI app, starts everything
  database.py        ← Postgres connection + session factory
  models.py          ← SQLAlchemy table definitions
  schemas.py         ← Pydantic request/response shapes
  routers/
    courts.py        ← court routes
    groups.py        ← group routes
    users.py         ← user routes
  .env               ← DATABASE_URL (never commit)
  requirements.txt   ← pip dependencies
```

---

## All 7 Endpoints

```
GET  /courts                  → home screen court list
GET  /courts/{id}             → court detail header
GET  /courts/{id}/groups      → open groups at a court

POST /groups                  → create screen "Post Game"
POST /groups/{id}/join        → join button

POST /users                   → create a user (no password)
GET  /users/{id}              → profile screen
```

---

## Frontend Config

Add one file to the Expo project:

```ts
// src/config/api.ts
export const API_URL = 'http://192.168.x.x:8000'  // your laptop's local IP
```

Find your IP:
- Mac: `ipconfig getifaddr en0` in terminal
- Windows: `ipconfig` → look for IPv4 Address

Every fetch call in the app points to `API_URL`. When you deploy for real, change this one line.

---

## Phase 1 — Foundation
**Goal:** FastAPI running, tables exist in Postgres, `/docs` loads in browser.

### Install dependencies
```bash
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary python-dotenv
```

### Files to write
1. `.env` — database connection string
2. `database.py` — engine + session
3. `models.py` — Court, Group, User tables
4. `main.py` — app startup, create tables

### Done when
- `uvicorn main:app --reload` runs with no errors
- `http://localhost:8000/docs` loads FastAPI UI
- Tables visible in Postgres

---

## Phase 2 — Courts API
**Goal:** Home screen loads real courts from the database.

### Backend
- `GET /courts` — return all courts with active_players + open_groups counts
- `GET /courts/{id}` — return single court

### Frontend
- Replace `mockCourts.ts` import in `HomeScreen` with a `useEffect` fetch
- Add loading state (spinner) and error state ("Something went wrong")
- File to touch: `src/screens/HomeScreen.tsx`

### Done when
- Phone shows courts from Postgres, not mock data
- Seeded courts (Walnut Grove, The Hub Center, Sunset Ridge) appear on screen

---

## Phase 3 — Groups API
**Goal:** Court detail shows real groups. Create screen posts real data.

### Backend
- `GET /courts/{id}/groups` — return open groups for a court
- `POST /groups` — create a new group, body includes court_id, host_id, players_needed, skill_level, duration, tags

### Frontend
- Replace `mockGroups.ts` import in `CourtDetailScreen` with a fetch
- On "Post Game" in `CreateScreen`, send POST to `/groups` instead of updating context
- Navigate to court detail after successful POST
- Files to touch: `src/screens/CourtDetailScreen.tsx`, `src/screens/CreateScreen.tsx`

### Done when
- Open groups load from database on court detail screen
- Posting a game from Create screen saves to Postgres
- New group appears at top of court detail immediately after posting

---

## Phase 4 — Join API
**Goal:** Join button writes to the database.

### Backend
- `POST /groups/{id}/join` — body includes user_id, records the join

### New table needed
```
group_members
  id
  group_id   (FK → groups)
  user_id    (FK → users)
  joined_at
```

### Frontend
- Join button calls `POST /groups/{id}/join` instead of flipping local state
- Still shows "Joined!" on success
- File to touch: `src/components/GroupCard.tsx`

### Done when
- Joining a group persists after app restart
- Join recorded in `group_members` table

---

## Phase 5 — Users API
**Goal:** Owen becomes a real user stored in the database.

### Backend
- `POST /users` — create user with display_name + optional avatar_url, returns user object with id
- `GET /users/{id}` — return user profile

### Frontend
- On first app launch, POST to `/users` with display name "Owen"
- Store the returned `user.id` in AsyncStorage
- All subsequent requests (POST /groups, POST /groups/{id}/join) send this user_id
- Profile screen fetches from `GET /users/{id}`
- Files to touch: `src/context/AppContext.tsx`, `src/screens/ProfileScreen.tsx`

### Install
```bash
npx expo install @react-native-async-storage/async-storage
```

### Done when
- Owen has a real ID in the database
- Profile screen data comes from the API
- App remembers the user between restarts

---

## Running Everything

### Every dev session
```bash
# Terminal 1 — backend
cd picker-backend
uvicorn main:app --reload

# Terminal 2 — frontend
cd Picker
npx expo start --tunnel --clear
```

### Seeding the database
After Phase 1, run a quick seed script to insert the 3 mock courts into Postgres so the app has data immediately:

```python
# seed.py
from database import SessionLocal
from models import Court

db = SessionLocal()
courts = [
    Court(id='walnut-grove', name='Walnut Grove', active_players=22, tags=['Music', 'Casual']),
    Court(id='hub-center', name='The Hub Center', active_players=14, tags=['Competitive']),
    Court(id='sunset-ridge', name='Sunset Ridge', active_players=8, tags=['Social', 'Sunset Play']),
]
db.add_all(courts)
db.commit()
db.close()
```

Run with: `python seed.py`

---

## Common Issues to Watch For

| Problem | Fix |
|---|---|
| Phone can't reach API | Make sure phone + laptop are on same WiFi. Double-check your local IP in `api.ts` |
| CORS error in console | Add `fastapi.middleware.cors` to `main.py` — allow all origins during dev |
| `active_players` always 0 | This is a computed field — count rows in `group_members`, not a stored column |
| ngrok URL changes | Don't use ngrok for local dev — use local IP instead |
| Postgres connection refused | Make sure Postgres is running (`pg_ctl status` or check Postgres.app) |

---

## Definition of Done

- [ ] Phone loads real courts from Postgres
- [ ] Court detail shows real open groups
- [ ] Posting a game saves to the database
- [ ] Joining a group persists after app restart
- [ ] Owen is a real user with a database ID
- [ ] `mockCourts.ts` and `mockGroups.ts` are no longer imported anywhere
- [ ] `localhost:8000/docs` shows all 7 endpoints

---

## What's NOT in This Plan (yet)

- Auth / passwords / JWT
- Real-time updates
- Push notifications
- Image uploads
- Group expiry logic
- Deployment / hosting
- Map tab backend (coordinates)s