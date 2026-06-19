import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { cardShadow, colors } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const { activeGroup, user } = useApp();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Pressable style={styles.settings}>
            <Ionicons color={colors.ink} name="settings-outline" size={21} />
          </Pressable>
        </View>

        <View style={styles.identity}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>
                {user.displayName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.online} />
          </View>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.home}>Langley, BC</Text>
        </View>

        <Text style={styles.sectionLabel}>MY ACTIVE GROUP</Text>
        {activeGroup ? (
          <Pressable
            onPress={() =>
              navigation.navigate('CourtDetail', { courtId: activeGroup.courtId })
            }
            style={styles.activeCard}
          >
            <View style={styles.activeIcon}>
              <Ionicons color={colors.primary} name="people" size={22} />
            </View>
            <View style={styles.activeCopy}>
              <Text style={styles.activeTitle}>{activeGroup.courtId}</Text>
              <Text style={styles.activeMeta}>
                {activeGroup.startsIn} · Need {activeGroup.playersNeeded} more
              </Text>
            </View>
            <Ionicons color={colors.muted} name="chevron-forward" size={20} />
          </Pressable>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons color={colors.primary} name="tennisball-outline" size={25} />
            </View>
            <Text style={styles.emptyTitle}>No active game</Text>
            <Text style={styles.emptyText}>Join or post a group to see it here.</Text>
            <Pressable
              onPress={() => navigation.navigate('Home')}
              style={styles.findButton}
            >
              <Text style={styles.findText}>Find a game</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menu}>
          <MenuRow icon="person-outline" label="Edit profile" />
          <View style={styles.divider} />
          <MenuRow icon="notifications-outline" label="Notifications" />
          <View style={styles.divider} />
          <MenuRow icon="help-circle-outline" label="Help & feedback" />
        </View>

        <Text style={styles.version}>Picker MVP · Version 1.0</Text>
      </View>
    </SafeAreaView>
  );
}

function MenuRow({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Pressable style={styles.menuRow}>
      <Ionicons color={colors.primary} name={icon} size={20} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons color="#A4AAA7" name="chevron-forward" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  content: { flex: 1, paddingHorizontal: 18 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 17,
  },
  title: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  settings: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  identity: { alignItems: 'center', marginTop: 34 },
  avatarRing: {
    alignItems: 'center',
    backgroundColor: colors.softLime,
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    position: 'relative',
    width: 96,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 39,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  online: {
    backgroundColor: '#66B47F',
    borderColor: colors.canvas,
    borderRadius: 9,
    borderWidth: 3,
    bottom: 5,
    height: 18,
    position: 'absolute',
    right: 5,
    width: 18,
  },
  name: { color: colors.ink, fontSize: 23, fontWeight: '900', marginTop: 14 },
  home: { color: colors.muted, fontSize: 11, marginTop: 3 },
  sectionLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 30,
  },
  activeCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 19,
    flexDirection: 'row',
    padding: 16,
    ...cardShadow,
  },
  activeIcon: {
    alignItems: 'center',
    backgroundColor: colors.softLime,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  activeCopy: { flex: 1, marginLeft: 12 },
  activeTitle: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  activeMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 19,
    padding: 22,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.softGreen,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 11,
  },
  emptyText: { color: colors.muted, fontSize: 10, marginTop: 4 },
  findButton: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    marginTop: 14,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  findText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: 19,
    paddingHorizontal: 16,
  },
  menuRow: { alignItems: 'center', flexDirection: 'row', minHeight: 53 },
  menuLabel: {
    color: colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 12,
  },
  divider: { backgroundColor: colors.line, height: 1, marginLeft: 32 },
  version: {
    color: '#A2A9A5',
    fontSize: 9,
    marginTop: 20,
    textAlign: 'center',
  },
});
