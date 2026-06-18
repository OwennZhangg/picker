import { Court } from '../types';

export const courts: Court[] = [
  {
    id: 'walnut-grove',
    name: 'Walnut Grove',
    neighborhood: 'North Langley',
    mapPosition: { left: '24%', top: '24%' },
    activePlayers: 22,
    openGroups: 2,
    distance: '0.8 km',
    tags: ['Music', 'Casual'],
    colors: ['#397D5F', '#194837'],
  },
  {
    id: 'hub-center',
    name: 'The Hub Center',
    neighborhood: 'Willoughby',
    mapPosition: { left: '63%', top: '43%' },
    activePlayers: 14,
    openGroups: 0,
    distance: '2.1 km',
    tags: ['Competitive'],
    colors: ['#D99A58', '#A8583A'],
  },
  {
    id: 'sunset-ridge',
    name: 'Sunset Ridge',
    neighborhood: 'Murrayville',
    mapPosition: { left: '34%', top: '69%' },
    activePlayers: 8,
    openGroups: 1,
    distance: '3.4 km',
    tags: ['Social', 'Sunset Play'],
    colors: ['#777BAE', '#414574'],
  },
];
