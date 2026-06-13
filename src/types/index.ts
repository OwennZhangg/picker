export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type DurationMinutes = 30 | 60 | 120;

export type Court = {
  id: string;
  name: string;
  neighborhood: string;
  mapPosition: {
    left: `${number}%`;
    top: `${number}%`;
  };
  distance: string;
  activePlayers: number;
  openGroups: number;
  tags: string[];
  colors: readonly [string, string];
};

export type Group = {
  id: string;
  courtId: string;
  hostName: string;
  playersNeeded: number;
  skillLevel: SkillLevel;
  startsIn: string;
  durationMinutes: DurationMinutes;
  tags: string[];
  createdAt: string;
  expiresAt: string;
};

export type User = {
  id: string;
  displayName: string;
};
