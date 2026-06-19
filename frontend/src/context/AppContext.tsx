import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Group, User } from '../types';

type AppContextValue = {
  groups: Group[];
  joinedGroupIds: string[];
  activeGroup?: Group;
  user: User;
  addGroup: (group: Group) => void;
  joinGroup: (groupId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const user = { id: 'local-user', displayName: 'Owen' };

  const value = useMemo<AppContextValue>(
    () => ({
      groups,
      joinedGroupIds,
      activeGroup: groups.find((group) => group.id === activeGroupId),
      user,
      addGroup: (group) => {
        setGroups((current) => [group, ...current]);
        setActiveGroupId(group.id);
      },
      joinGroup: (groupId) => {
        setJoinedGroupIds((current) =>
          current.includes(groupId) ? current : [...current, groupId],
        );
        setActiveGroupId(groupId);
      },
    }),
    [activeGroupId, groups, joinedGroupIds],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
