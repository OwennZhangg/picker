import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Court } from '../types';
import { cardShadow, colors } from '../theme';
import { CourtArtwork } from './CourtArtwork';
import { TagChip } from './TagChip';

type Props = {
  court: Court;
  openGroupCount: number;
  onPress: () => void;
};

export function CourtCard({ court, openGroupCount, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <CourtArtwork court={court}>
        <View style={styles.distance}>
          <Ionicons color="#FFFFFF" name="navigate" size={12} />
          <Text style={styles.distanceText}>{court.distance}</Text>
        </View>
        <View style={styles.heroCopy}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
          <Text style={styles.name}>{court.name}</Text>
          <Text style={styles.neighborhood}>{court.neighborhood}</Text>
        </View>
      </CourtArtwork>
      <View style={styles.body}>
        <View style={styles.stats}>
          <View>
            <Text style={styles.statValue}>{court.activePlayers}</Text>
            <Text style={styles.statLabel}>players here</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.statValue}>{openGroupCount}</Text>
            <Text style={styles.statLabel}>
              {openGroupCount === 1 ? 'open group' : 'open groups'}
            </Text>
          </View>
          <View style={styles.arrow}>
            <Ionicons color={colors.primary} name="arrow-forward" size={19} />
          </View>
        </View>
        <View style={styles.tags}>
          {court.tags.map((tag) => <TagChip key={tag} label={tag} />)}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 23,
    marginBottom: 18,
    overflow: 'hidden',
    ...cardShadow,
  },
  pressed: { opacity: 0.92 },
  distance: {
    alignItems: 'center',
    backgroundColor: 'rgba(23,34,29,0.42)',
    borderRadius: 99,
    flexDirection: 'row',
    gap: 5,
    left: 17,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    top: 15,
  },
  distanceText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  heroCopy: { bottom: 17, left: 19, position: 'absolute' },
  liveRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  liveDot: {
    backgroundColor: colors.lime,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 7,
  },
  neighborhood: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    marginTop: 2,
  },
  body: { padding: 17 },
  stats: { alignItems: 'center', flexDirection: 'row' },
  statValue: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 1 },
  divider: {
    backgroundColor: colors.line,
    height: 30,
    marginHorizontal: 18,
    width: 1,
  },
  arrow: {
    alignItems: 'center',
    backgroundColor: colors.softLime,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginLeft: 'auto',
    width: 36,
  },
  tags: { flexDirection: 'row', gap: 7, marginTop: 14 },
});
