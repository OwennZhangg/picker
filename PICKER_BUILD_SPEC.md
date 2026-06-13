# Picker MVP Build Spec

## Product Summary

Picker is a mobile-first pickleball app that helps players quickly answer one question:

> Where can I play pickleball right now?

The MVP should focus on active courts and open groups. Users should be able to see where people are playing, see which groups need players, and post that they need players.

Do not build a full social network yet. Keep the first version simple, fast, and easy to understand.

---

## Core MVP Goals

1. Show active pickleball courts.
2. Show how many players are currently at each court.
3. Show how many groups are looking for players.
4. Let a user create a simple “Need Players” post.
5. Let a user join an open group.
6. Keep the UI clean and mobile-first.

---

## Tech Direction

Build the first version as a frontend prototype with static JSON data.

Recommended stack:

- React Native
- Expo
- TypeScript
- React Navigation
- Static mock data first

Do not build backend, auth, database, or cloud deployment yet.

---

## App Name

Use:

**Picker**

Avoid using CourtPulse in the UI unless it is still present in exported Stitch files and needs replacing.

---

## Navigation

Use 3 bottom tabs only:

1. Home
2. Create
3. Profile

Do not include extra tabs like Explore, Courts, Feed, or Activity.

---

## Screen 1: Home / Active Courts

Purpose:
Help users instantly see where people are playing.

### Required UI

Header:

- Picker logo or simple paddle/ball icon
- App name: Picker
- Optional map/search icons

Main title:

```text
Active Courts
```

Subtitle:

```text
Real-time games happening near you.
```

Court cards should show:

- Court image
- Court name
- Active player count
- Number of open groups
- Distance from user
- Vibe tags
- View Court button

Example card:

```text
Walnut Grove
22 players active
2 groups looking
0.8 km away

[MUSIC] [CASUAL]

[View Court]
```

### Court Card Data

Use this mock data:

```ts
const courts = [
  {
    id: 'walnut-grove',
    name: 'Walnut Grove',
    activePlayers: 22,
    openGroups: 2,
    distance: '0.8 km',
    tags: ['Music', 'Casual'],
    imageUrl: 'placeholder',
  },
  {
    id: 'hub-center',
    name: 'The Hub Center',
    activePlayers: 14,
    openGroups: 0,
    distance: '2.1 km',
    tags: ['Competitive'],
    imageUrl: 'placeholder',
  },
  {
    id: 'sunset-ridge',
    name: 'Sunset Ridge',
    activePlayers: 8,
    openGroups: 1,
    distance: '3.4 km',
    tags: ['Social', 'Sunset Play'],
    imageUrl: 'placeholder',
  },
];
```

---

## Screen 2: Court Detail

Purpose:
Help users see who needs players and join a group.

### Required UI

Top section:

- Court image
- Court name
- Active players count
- Open groups count

Example:

```text
Walnut Grove
22 players here now
2 games looking for players
```

Section title:

```text
Open Groups
```

Group cards should show:

- Host name
- Start time
- Players needed
- Tags
- Join Group button

Example group card:

```text
Owen
Starting now
Need 2 more

[Casual] [Music] [Drinks after]

[Join Group]
```

### Mock Group Data

```ts
const groups = [
  {
    id: 'group-1',
    courtId: 'walnut-grove',
    hostName: 'Owen',
    startsIn: 'Starting now',
    playersNeeded: 2,
    skillLevel: 'Intermediate',
    tags: ['Casual', 'Music', 'Drinks after'],
  },
  {
    id: 'group-2',
    courtId: 'walnut-grove',
    hostName: 'Sarah',
    startsIn: 'In 15 mins',
    playersNeeded: 1,
    skillLevel: 'Competitive',
    tags: ['Competitive', 'Drills'],
  },
  {
    id: 'group-3',
    courtId: 'walnut-grove',
    hostName: 'Marcus',
    startsIn: 'In 30 mins',
    playersNeeded: 3,
    skillLevel: 'Beginner',
    tags: ['Intro to Play', 'Fun'],
  },
];
```

### Join Group Behavior

For prototype:

- On tap, change button text from `Join Group` to `Joined!`
- No backend call required
- Optional: show a small success toast

---

## Screen 3: Create / Need Players

Purpose:
Let someone quickly post that they need players.

Rename the screen from:

```text
Create Group
```

to:

```text
Need Players
```

Subtitle:

```text
Post a game and find players nearby.
```

### Required Fields

1. Display Name
2. Court
3. Players Needed
4. Skill Level
5. Duration
6. Optional Vibe Tags

### Field Details

Display Name:

```text
Owen
```

Court selector:

```text
Walnut Grove
The Hub Center
Sunset Ridge
```

Players Needed:

```text
1 / 2 / 3 / 4
```

Skill Level:

```text
Beginner / Intermediate / Advanced
```

Duration:

```text
30m / 1h / 2h
```

Optional Vibe Tags:

```text
Casual
Competitive
Music
Students
Night Session
Drinks after
```

Primary button:

```text
Post Game
```

### Prototype Behavior

For now, on submit:

- Validate that display name is not empty
- Create a temporary local group object
- Navigate to the selected court detail screen
- Show the new group at the top of Open Groups

No backend required.

---

## Screen 4: Profile

Purpose:
Minimal user identity for prototype.

Keep this screen very small.

### Required UI

```text
Profile photo
Display name

My Active Group
Settings
```

Do not include:

- DUPR
- rankings
- followers
- full group history
- achievements
- stats
- clubs
- established dates

For MVP, profile only exists so users understand who they are posting as.

---

## Design Rules

Prioritize clarity over creativity.

The app should be understandable in 3 seconds.

### Keep

- Big court cards
- Large buttons
- Simple copy
- Active player count
- Open group count
- Distance
- Vibe tags

### Avoid

- Social feed
- Stories
- Leaderboards
- Rankings
- DUPR labels
- Complex profiles
- Too many tabs
- Too many filters
- Long descriptions

---

## Copy Guidelines

Use casual but clear language.

Prefer:

```text
Need 2 more
Starting now
22 players here now
2 games looking
Post Game
Join Group
```

Avoid:

```text
Create Listing
Participants active
Availability session
Competitive engagement
```

---

## Data Model for Future Backend

Do not implement backend yet, but design frontend state around these future objects.

### Court

```ts
type Court = {
  id: string;
  name: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  distance?: string;
  activePlayers: number;
  openGroups: number;
  tags: string[];
};
```

### Group

```ts
type Group = {
  id: string;
  courtId: string;
  hostName: string;
  playersNeeded: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  startsIn: string;
  durationMinutes: 30 | 60 | 120;
  tags: string[];
  createdAt: string;
  expiresAt: string;
};
```

### User

```ts
type User = {
  id: string;
  displayName: string;
  avatarUrl?: string;
};
```

---

## Suggested File Structure

```text
src/
  app/
    navigation/
      AppNavigator.tsx
  screens/
    HomeScreen.tsx
    CourtDetailScreen.tsx
    CreateScreen.tsx
    ProfileScreen.tsx
  components/
    CourtCard.tsx
    GroupCard.tsx
    TagChip.tsx
    PrimaryButton.tsx
  data/
    mockCourts.ts
    mockGroups.ts
  types/
    index.ts
```

---

## First Build Checklist

### Step 1
Set up Expo React Native with TypeScript.

### Step 2
Create bottom tab navigation:

- Home
- Create
- Profile

### Step 3
Build HomeScreen with static court cards.

### Step 4
Build CourtDetailScreen with static groups.

### Step 5
Build CreateScreen with local form state.

### Step 6
On Post Game, add the group locally and navigate to CourtDetailScreen.

### Step 7
Build minimal ProfileScreen.

### Step 8
Run on phone using Expo Go.

---

## Definition of Done

The prototype is done when:

1. User can open the app and see active courts.
2. User can tap a court and see open groups.
3. User can tap Join Group and see confirmation.
4. User can post a new game from the Create screen.
5. User can see their new game on the court detail screen.
6. App uses the name Picker instead of CourtPulse.
7. No backend or login is required.

---

## Important Product Principle

Do not overbuild.

The MVP is not a pickleball social network yet.

The MVP is the fastest way to find a game.
