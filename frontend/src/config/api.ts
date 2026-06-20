import { Court, DurationMinutes, Group, SkillLevel, User} from '../types';

// Use your Mac's WiFi IP here when testing on a real phone.
export const API_URL = 'http://10.0.0.232:8000';

type ApiCourt = {
  id: string;
  name: string;
  active_players: number;
  distance: string | null;
  image_url: string | null;
  tags: string[];
};

type ApiGroup = {
  id: number;
  court_id: string;
  host_name: string;
  starts_in: string;
  players_needed: number;
  skill_level: string;
  tags: string[];
};

export type CreateGroupInput = {
  courtId: string;
  hostName: string;
  playersNeeded: number;
  skillLevel: SkillLevel;
  durationMinutes: DurationMinutes;
  tags: string[];
};

const courtVisuals: Record<
  string,
  Pick<Court, 'neighborhood' | 'mapPosition' | 'colors'>
> = {
  'walnut-grove': {
    neighborhood: 'North Langley',
    mapPosition: { left: '24%', top: '24%' },
    colors: ['#397D5F', '#194837'],
  },
  'hub-center': {
    neighborhood: 'Willoughby',
    mapPosition: { left: '63%', top: '43%' },
    colors: ['#D99A58', '#A8583A'],
  },
  'sunset-ridge': {
    neighborhood: 'Murrayville',
    mapPosition: { left: '34%', top: '69%' },
    colors: ['#777BAE', '#414574'],
  },
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function mapCourt(apiCourt: ApiCourt, openGroups = 0): Court {
  const visuals = courtVisuals[apiCourt.id] ?? {
    neighborhood: 'Langley',
    mapPosition: { left: '50%', top: '50%' } as const,
    colors: ['#397D5F', '#194837'] as const,
  };

  return {
    id: apiCourt.id,
    name: apiCourt.name,
    activePlayers: apiCourt.active_players,
    openGroups,
    distance: apiCourt.distance ?? '',
    tags: apiCourt.tags,
    ...visuals,
  };
}

function mapGroup(apiGroup: ApiGroup): Group {
  const now = new Date();

  return {
    id: String(apiGroup.id),
    courtId: apiGroup.court_id,
    hostName: apiGroup.host_name,
    playersNeeded: apiGroup.players_needed,
    skillLevel: apiGroup.skill_level as SkillLevel,
    startsIn: apiGroup.starts_in,
    durationMinutes: 60,
    tags: apiGroup.tags,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
  };
}

export async function fetchCourts(): Promise<Court[]> {
  const apiCourts = await request<ApiCourt[]>('/courts');
  const groupLists = await Promise.all(
    apiCourts.map((court) => request<ApiGroup[]>(`/courts/${court.id}/groups`)),
  );

  return apiCourts.map((court, index) => mapCourt(court, groupLists[index].length));
}

export async function fetchCourt(courtId: string): Promise<Court> {
  const [court, groups] = await Promise.all([
    request<ApiCourt>(`/courts/${courtId}`),
    request<ApiGroup[]>(`/courts/${courtId}/groups`),
  ]);

  return mapCourt(court, groups.length);
}

export async function fetchCourtGroups(courtId: string): Promise<Group[]> {
  const groups = await request<ApiGroup[]>(`/courts/${courtId}/groups`);
  return groups.map(mapGroup);
}

export async function createGroup(input: CreateGroupInput): Promise<Group> {
  const group = await request<ApiGroup>('/groups', {
    body: JSON.stringify({
      court_id: input.courtId,
      host_name: input.hostName,
      starts_in: 'Starting now',
      players_needed: input.playersNeeded,
      skill_level: input.skillLevel,
      tags: input.tags,
    }),
    method: 'POST',
  });

  return {
    ...mapGroup(group),
    durationMinutes: input.durationMinutes,
  };
}

type ApiUser = {
  id: number;
  display_name: string;
  avatar_url: string | null;
};

function mapUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.id),
    displayName: apiUser.display_name,
  };
}

export async function createUser(displayName: string): Promise<User> {
  const user = await request<ApiUser>('/users', {
    method: 'POST',
    body: JSON.stringify({
      display_name: displayName,
      avatar_url: null,
    }),
  });

  return mapUser(user);
}

export async function fetchUser(userId: string): Promise<User> {
  const user = await request<ApiUser>(`/users/${userId}`);
  return mapUser(user);
}

export async function joinGroup(groupId: string, userId: string): Promise<void> {
  await request(`/groups/${groupId}/join`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: Number(userId),
    }),
  });
}