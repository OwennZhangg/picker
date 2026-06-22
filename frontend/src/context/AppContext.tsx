import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUser,
  fetchActiveGroup,
  fetchUser,
  joinGroup as joinGroupRequest,
  leaveGroup as leaveGroupRequest,
} from '../config/api';
import { Group, User } from '../types';

const USER_ID_STORAGE_KEY = 'picker_user_id';

type AppContextValue = {
  groups: Group[];
  joinedGroupIds: string[];
  activeGroup?: Group;
  loadingUser: boolean;
  user: User | null;
  addGroup: (group: Group) => void;
  createProfile: (displayName: string) => Promise<void>;
  joinGroup: (group: Group) => Promise<void>;
  leaveGroup: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group>();
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedUserId = await AsyncStorage.getItem(USER_ID_STORAGE_KEY);
        await AsyncStorage.removeItem('picker_active_group');

        if (savedUserId) {
          const savedUser = await fetchUser(savedUserId);
          const savedActiveGroup = await fetchActiveGroup(savedUserId);
          setUser(savedUser);
          if (savedActiveGroup) {
            setActiveGroup(savedActiveGroup);
            setJoinedGroupIds([savedActiveGroup.id]);
          }
        }
      } catch {
        await AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      groups,
      joinedGroupIds,
      activeGroup,
      loadingUser,
      user,
      addGroup: (group) => {
        setGroups((current) => [group, ...current]);
        setActiveGroup(group);
      },
      createProfile: async (displayName) => {
        const newUser = await createUser(displayName);
        await AsyncStorage.setItem(USER_ID_STORAGE_KEY, newUser.id);
        setUser(newUser);
      },
      joinGroup: async (group) => {
        if (!user) {
          return;
        }

        await joinGroupRequest(group.id, user.id);

        setJoinedGroupIds([group.id]);
        setActiveGroup({
          ...group,
          playersNeeded: Math.max(group.playersNeeded - 1, 0),
        });
      },
      leaveGroup: async () => {
        if (!user || !activeGroup) {
          return;
        }

        await leaveGroupRequest(activeGroup.id, user.id);

        setJoinedGroupIds([]);
        setActiveGroup(undefined);
      },
    }),
    [activeGroup, groups, joinedGroupIds, loadingUser, user],
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
