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
  fetchUser,
  joinGroup as joinGroupRequest,
} from '../config/api';
import { Group, User } from '../types';

const USER_ID_STORAGE_KEY = 'picker_user_id';
const ACTIVE_GROUP_STORAGE_KEY = 'picker_active_group';

type AppContextValue = {
  groups: Group[];
  joinedGroupIds: string[];
  activeGroup?: Group;
  loadingUser: boolean;
  user: User | null;
  addGroup: (group: Group) => void;
  createProfile: (displayName: string) => Promise<void>;
  joinGroup: (group: Group) => Promise<void>;
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
        const savedActiveGroup = await AsyncStorage.getItem(ACTIVE_GROUP_STORAGE_KEY);

        if (savedUserId) {
          const savedUser = await fetchUser(savedUserId);
          setUser(savedUser);
        }

        if (savedActiveGroup) {
          const parsedActiveGroup = JSON.parse(savedActiveGroup);
          setActiveGroup(parsedActiveGroup);
          setJoinedGroupIds([parsedActiveGroup.id]);
        }
      } catch {
        await AsyncStorage.removeItem(USER_ID_STORAGE_KEY);
        await AsyncStorage.removeItem(ACTIVE_GROUP_STORAGE_KEY);
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
        AsyncStorage.setItem(ACTIVE_GROUP_STORAGE_KEY, JSON.stringify(group));
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
        setActiveGroup(group);
        await AsyncStorage.setItem(ACTIVE_GROUP_STORAGE_KEY, JSON.stringify(group));
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
