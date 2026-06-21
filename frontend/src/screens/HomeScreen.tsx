import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourtCard } from '../components/CourtCard';
import { fetchCourts } from '../config/api';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { colors } from '../theme';
import { Court } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourts = useCallback(async () => {
    try {
      setError(null);
      setCourts(await fetchCourts());
    } catch {
      setError('Could not load courts');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCourts();
    }, [loadCourts]),
  );

  const totalPlayers = courts.reduce((sum, court) => sum + court.activePlayers, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons color={colors.primary} name="tennisball" size={23} />
            </View>
            <Text style={styles.brandName}>Picker</Text>
          </View>
          <View style={styles.location}>
            <Ionicons color={colors.primary} name="location" size={14} />
            <Text style={styles.locationText}>Langley, BC</Text>
            <Ionicons color={colors.muted} name="chevron-down" size={13} />
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>{totalPlayers} PLAYERS NEARBY</Text>
          <Text style={styles.title}>Active Courts</Text>
          <Text style={styles.subtitle}>Real-time games happening near you.</Text>
        </View>

        <View style={styles.updateRow}>
          <View style={styles.pulse} />
          <Text style={styles.updateText}>Updated just now</Text>
          <View style={styles.rule} />
          <Ionicons color={colors.muted} name="options-outline" size={19} />
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          courts.map((court) => (
            <CourtCard
              court={court}
              key={court.id}
              onPress={() => navigation.navigate('CourtDetail', { courtId: court.id })}
              openGroupCount={court.openGroups}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  content: { paddingBottom: 28, paddingHorizontal: 18 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  brand: { alignItems: 'center', flexDirection: 'row' },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    width: 42,
  },
  brandName: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginLeft: 10,
  },
  location: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  locationText: { color: colors.ink, fontSize: 10, fontWeight: '700' },
  intro: { marginTop: 36 },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: {
    color: colors.ink,
    fontSize: 35,
    fontWeight: '900',
    letterSpacing: -1.3,
    marginTop: 8,
  },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 5 },
  updateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 23,
  },
  pulse: {
    backgroundColor: '#54A876',
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  updateText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 7,
  },
  rule: {
    backgroundColor: colors.line,
    flex: 1,
    height: 1,
    marginHorizontal: 12,
  },
  errorText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
});
