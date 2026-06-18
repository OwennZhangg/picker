import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourtArtwork } from '../components/CourtArtwork';
import { GroupCard } from '../components/GroupCard';
import { useApp } from '../context/AppContext';
import { courts } from '../data/mockCourts';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CourtDetail'>;

export function CourtDetailScreen({ navigation, route }: Props) {
  const { groups } = useApp();
  const court = courts.find((item) => item.id === route.params.courtId) ?? courts[0];
  const courtGroups = groups.filter((group) => group.courtId === court.id);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CourtArtwork court={court} height={320}>
          <SafeAreaView edges={['top']} style={styles.hero}>
            <View style={styles.heroNav}>
              <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Ionicons color="#FFFFFF" name="arrow-back" size={21} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons color="#FFFFFF" name="share-outline" size={20} />
              </Pressable>
            </View>
            <View style={styles.heroCopy}>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>PLAYING NOW</Text>
              </View>
              <Text style={styles.title}>{court.name}</Text>
              <View style={styles.location}>
                <Ionicons color="rgba(255,255,255,0.75)" name="location" size={14} />
                <Text style={styles.locationText}>
                  {court.neighborhood} · {court.distance} away
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </CourtArtwork>

        <View style={styles.body}>
          <View style={styles.statCard}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{court.activePlayers}</Text>
              <Text style={styles.statLabel}>players here now</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{courtGroups.length}</Text>
              <Text style={styles.statLabel}>games looking</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Open Groups</Text>
              <Text style={styles.sectionSubtitle}>Jump into a game nearby.</Text>
            </View>
            <View style={styles.count}>
              <Text style={styles.countText}>{courtGroups.length}</Text>
            </View>
          </View>

          {courtGroups.length > 0 ? (
            courtGroups.map((group) => <GroupCard group={group} key={group.id} />)
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons color={colors.primary} name="people-outline" size={27} />
              </View>
              <Text style={styles.emptyTitle}>No open groups yet</Text>
              <Text style={styles.emptyText}>Start one and invite nearby players.</Text>
              <Pressable
                onPress={() =>
                  navigation.navigate('Tabs', {
                    screen: 'Create',
                    params: { courtId: court.id },
                  })
                }
                style={styles.emptyButton}
              >
                <Text style={styles.emptyButtonText}>Post a game</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  hero: { flex: 1, paddingHorizontal: 18 },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(23,34,29,0.38)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 19,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  heroCopy: { bottom: 34, position: 'absolute' },
  liveRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginBottom: 9,
  },
  liveDot: {
    backgroundColor: colors.lime,
    borderRadius: 5,
    height: 9,
    width: 9,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  location: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
  },
  locationText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
  body: { paddingBottom: 36, paddingHorizontal: 18 },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    marginTop: -20,
    padding: 19,
  },
  stat: { flex: 1 },
  statValue: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
  divider: {
    backgroundColor: colors.line,
    marginHorizontal: 18,
    width: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 30,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  sectionSubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  count: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  countText: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.softGreen,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyText: { color: colors.muted, fontSize: 12, marginTop: 5 },
  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: 13,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
