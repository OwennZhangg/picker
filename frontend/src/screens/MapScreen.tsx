import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { TagChip } from '../components/TagChip';
import { fetchCourts } from '../config/api';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { cardShadow, colors } from '../theme';
import { Court } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Map'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function MapScreen({ navigation }: Props) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourts() {
      try {
        const nextCourts = await fetchCourts();
        setCourts(nextCourts);
        setSelectedCourtId(nextCourts[0]?.id ?? '');
      } catch {
        setError('Could not load courts');
      } finally {
        setLoading(false);
      }
    }

    loadCourts();
  }, []);

  const selectedCourt =
    courts.find((court) => court.id === selectedCourtId) ?? courts[0];

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safeArea, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !selectedCourt) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safeArea, styles.center]}>
        <Text style={styles.errorText}>{error ?? 'No courts found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>LANGLEY, BC</Text>
          <Text style={styles.title}>Court Map</Text>
        </View>
        <Pressable style={styles.locationButton}>
          <Ionicons color={colors.primary} name="locate" size={21} />
        </Pressable>
      </View>

      <View style={styles.map}>
        <View style={[styles.neighborhood, styles.northLabel]}>
          <Text style={styles.neighborhoodText}>WALNUT GROVE</Text>
        </View>
        <View style={[styles.neighborhood, styles.centerLabel]}>
          <Text style={styles.neighborhoodText}>WILLOUGHBY</Text>
        </View>
        <View style={[styles.neighborhood, styles.southLabel]}>
          <Text style={styles.neighborhoodText}>MURRAYVILLE</Text>
        </View>

        <View style={[styles.road, styles.roadOne]} />
        <View style={[styles.road, styles.roadTwo]} />
        <View style={[styles.road, styles.roadThree]} />
        <View style={[styles.road, styles.roadFour]} />
        <View style={[styles.park, styles.parkOne]} />
        <View style={[styles.park, styles.parkTwo]} />
        <View style={styles.water} />

        <View style={styles.userLocation}>
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
        </View>

        {courts.map((court) => {
          const selected = court.id === selectedCourt.id;
          return (
            <Pressable
              accessibilityLabel={`${court.name}, ${court.activePlayers} players`}
              key={court.id}
              onPress={() => setSelectedCourtId(court.id)}
              style={[
                styles.markerWrap,
                court.mapPosition,
                selected && styles.markerWrapSelected,
              ]}
            >
              <View style={[styles.marker, selected && styles.markerSelected]}>
                <Ionicons
                  color={selected ? colors.primaryDark : '#FFFFFF'}
                  name="tennisball"
                  size={18}
                />
              </View>
              <View style={styles.markerBadge}>
                <Text style={styles.markerBadgeText}>{court.activePlayers}</Text>
              </View>
              {court.openGroups > 0 ? <View style={styles.liveDot} /> : null}
            </Pressable>
          );
        })}

        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Open groups available</Text>
        </View>
      </View>

      <View style={styles.preview}>
        <View style={styles.previewTop}>
          <View style={styles.previewCopy}>
            <Text style={styles.distance}>{selectedCourt.distance} AWAY</Text>
            <Text style={styles.courtName}>{selectedCourt.name}</Text>
            <Text style={styles.neighborhoodName}>
              {selectedCourt.neighborhood}
            </Text>
          </View>
          <View style={styles.playerCount}>
            <Text style={styles.playerValue}>{selectedCourt.activePlayers}</Text>
            <Text style={styles.playerLabel}>PLAYING</Text>
          </View>
        </View>

        <View style={styles.groupRow}>
          <Ionicons color={colors.primary} name="people" size={17} />
          <Text style={styles.groupText}>
            {selectedCourt.openGroups}{' '}
            {selectedCourt.openGroups === 1 ? 'group is' : 'groups are'} looking
            for players
          </Text>
        </View>

        <View style={styles.tags}>
          {selectedCourt.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </View>

        <PrimaryButton
          label="View Court"
          onPress={() =>
            navigation.navigate('CourtDetail', {
              courtId: selectedCourt.id,
            })
          }
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  title: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 4,
  },
  locationButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  map: {
    backgroundColor: '#E9E9DE',
    flex: 1,
    marginHorizontal: 12,
    minHeight: 350,
    overflow: 'hidden',
    position: 'relative',
  },
  neighborhood: {
    position: 'absolute',
    zIndex: 2,
  },
  northLabel: { left: '47%', top: '12%' },
  centerLabel: { left: '15%', top: '48%' },
  southLabel: { left: '57%', top: '78%' },
  neighborhoodText: {
    color: '#A1A79F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  road: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8DAD2',
    borderWidth: 1,
    height: 16,
    position: 'absolute',
    width: '130%',
  },
  roadOne: {
    left: '-12%',
    top: '29%',
    transform: [{ rotate: '17deg' }],
  },
  roadTwo: {
    left: '-15%',
    top: '63%',
    transform: [{ rotate: '-11deg' }],
  },
  roadThree: {
    left: '-34%',
    top: '47%',
    transform: [{ rotate: '67deg' }],
  },
  roadFour: {
    left: '28%',
    top: '45%',
    transform: [{ rotate: '83deg' }],
  },
  park: {
    backgroundColor: '#D3E3C7',
    borderRadius: 80,
    position: 'absolute',
  },
  parkOne: {
    height: 120,
    right: -28,
    top: 34,
    transform: [{ rotate: '-12deg' }],
    width: 145,
  },
  parkTwo: {
    bottom: 26,
    height: 105,
    left: -32,
    width: 135,
  },
  water: {
    backgroundColor: '#CFE4E5',
    borderRadius: 80,
    bottom: -52,
    height: 110,
    position: 'absolute',
    right: -20,
    transform: [{ rotate: '-10deg' }],
    width: 230,
  },
  userLocation: {
    alignItems: 'center',
    justifyContent: 'center',
    left: '49%',
    position: 'absolute',
    top: '57%',
    zIndex: 4,
  },
  userPulse: {
    backgroundColor: 'rgba(48,115,214,0.18)',
    borderRadius: 25,
    height: 50,
    position: 'absolute',
    width: 50,
  },
  userDot: {
    backgroundColor: '#3073D6',
    borderColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 3,
    height: 16,
    width: 16,
  },
  markerWrap: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    marginLeft: -25,
    marginTop: -25,
    position: 'absolute',
    width: 50,
    zIndex: 5,
  },
  markerWrapSelected: {
    transform: [{ scale: 1.12 }],
  },
  marker: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 3,
    height: 38,
    justifyContent: 'center',
    width: 38,
    ...cardShadow,
  },
  markerSelected: {
    backgroundColor: colors.lime,
  },
  markerBadge: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderColor: '#FFFFFF',
    borderRadius: 9,
    borderWidth: 2,
    height: 19,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 19,
  },
  markerBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  liveDot: {
    backgroundColor: colors.lime,
    borderColor: colors.primaryDark,
    borderRadius: 5,
    borderWidth: 1,
    bottom: 2,
    height: 10,
    position: 'absolute',
    right: 5,
    width: 10,
  },
  legend: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 99,
    bottom: 12,
    flexDirection: 'row',
    gap: 6,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    position: 'absolute',
  },
  legendDot: {
    backgroundColor: colors.lime,
    borderColor: colors.primary,
    borderRadius: 4,
    borderWidth: 1,
    height: 8,
    width: 8,
  },
  legendText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
  },
  preview: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -15,
    paddingBottom: 16,
    paddingHorizontal: 19,
    paddingTop: 19,
    zIndex: 8,
    ...cardShadow,
  },
  previewTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  previewCopy: {
    flex: 1,
  },
  distance: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  courtName: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  neighborhoodName: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  playerCount: {
    alignItems: 'center',
    backgroundColor: colors.softLime,
    borderRadius: 16,
    minWidth: 65,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  playerValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '900',
  },
  playerLabel: {
    color: colors.primary,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  groupRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 13,
  },
  groupText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 11,
  },
  button: {
    marginTop: 14,
    minHeight: 46,
  },
});
