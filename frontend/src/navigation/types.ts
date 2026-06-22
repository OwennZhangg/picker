import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Play: undefined;
  Create: { courtId?: string } | undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  CourtDetail: { courtId: string;};
  GroupDetail: { groupId: string; courtId: string };
};
