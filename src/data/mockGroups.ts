import { Group } from '../types';

const now = new Date();

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    courtId: 'walnut-grove',
    hostName: 'Owen',
    startsIn: 'Starting now',
    playersNeeded: 2,
    skillLevel: 'Intermediate',
    durationMinutes: 60,
    tags: ['Casual', 'Music', 'Drinks after'],
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'group-2',
    courtId: 'walnut-grove',
    hostName: 'Sarah',
    startsIn: 'In 15 mins',
    playersNeeded: 1,
    skillLevel: 'Advanced',
    durationMinutes: 120,
    tags: ['Competitive', 'Drills'],
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 135 * 60 * 1000).toISOString(),
  },
  {
    id: 'group-3',
    courtId: 'walnut-grove',
    hostName: 'Marcus',
    startsIn: 'In 30 mins',
    playersNeeded: 3,
    skillLevel: 'Beginner',
    durationMinutes: 60,
    tags: ['Intro to Play', 'Fun'],
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'group-4',
    courtId: 'sunset-ridge',
    hostName: 'Maya',
    startsIn: 'In 20 mins',
    playersNeeded: 1,
    skillLevel: 'Intermediate',
    durationMinutes: 60,
    tags: ['Social', 'Sunset Play'],
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 80 * 60 * 1000).toISOString(),
  },
];
