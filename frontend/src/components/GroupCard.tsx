import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { Group } from '../types';
import { cardShadow, colors } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { TagChip } from './TagChip';

export function GroupCard({ group }: { group: Group }) {
  const { joinedGroupIds, joinGroup } = useApp();
  const joined = joinedGroupIds.includes(group.id);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{group.hostName.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.host}>
          <Text style={styles.hostName}>{group.hostName}</Text>
          <Text style={styles.skill}>{group.skillLevel} player</Text>
        </View>
        <View style={styles.time}>
          <Ionicons color={colors.primary} name="time-outline" size={14} />
          <Text style={styles.timeText}>{group.startsIn}</Text>
        </View>
      </View>
      <View style={styles.needRow}>
        <Text style={styles.need}>Need {group.playersNeeded} more</Text>
        <Text style={styles.duration}>
          {group.durationMinutes === 30
            ? '30 min'
            : group.durationMinutes === 60 ? '1 hour' : '2 hours'}
        </Text>
      </View>
      <View style={styles.tags}>
        {group.tags.map((tag) => <TagChip key={tag} label={tag} />)}
      </View>
      <PrimaryButton
        disabled={joined}
        label={joined ? 'Joined!' : 'Join Group'}
        onPress={() => joinGroup(group.id)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 14,
    padding: 17,
    ...cardShadow,
  },
  top: { alignItems: 'center', flexDirection: 'row' },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.softLime,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  initials: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  host: { flex: 1, marginLeft: 11 },
  hostName: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  skill: { color: colors.muted, fontSize: 10, marginTop: 2 },
  time: {
    alignItems: 'center',
    backgroundColor: colors.softGreen,
    borderRadius: 99,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  timeText: { color: colors.primary, fontSize: 10, fontWeight: '700' },
  needRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginTop: 17,
  },
  need: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  duration: { color: colors.muted, fontSize: 11, marginLeft: 'auto' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 11 },
  button: { marginTop: 16 },
});
