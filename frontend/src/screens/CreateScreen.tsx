import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { createGroup, fetchCourts } from '../config/api';
import { useApp } from '../context/AppContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { colors } from '../theme';
import { Court, DurationMinutes, SkillLevel } from '../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Create'>,
  NativeStackScreenProps<RootStackParamList>
>;

const players = [1, 2, 3, 4];
const skills: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const durations: { label: string; value: DurationMinutes }[] = [
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '2h', value: 120 },
];
const vibeOptions = [
  'Casual',
  'Competitive',
  'Music',
  'Students',
  'Night Session',
  'Drinks after',
];

export function CreateScreen({ navigation, route }: Props) {
  const { addGroup, user } = useApp();
  const [courts, setCourts] = useState<Court[]>([]);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [courtId, setCourtId] = useState(route.params?.courtId ?? '');
  const [playersNeeded, setPlayersNeeded] = useState(2);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState<DurationMinutes>(60);
  const [tags, setTags] = useState<string[]>(['Casual']);
  const [error, setError] = useState('');
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCourts() {
      try {
        const nextCourts = await fetchCourts();
        setCourts(nextCourts);

        if (!route.params?.courtId && nextCourts.length > 0) {
          setCourtId(nextCourts[0].id);
        }
      } catch {
        setError('Could not load courts.');
      } finally {
        setLoadingCourts(false);
      }
    }

    loadCourts();
  }, [route.params?.courtId]);

  useEffect(() => {
    if (route.params?.courtId) {
      setCourtId(route.params.courtId);
    }
  }, [route.params?.courtId]);

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((currentTag) => currentTag !== tag)
        : [...current, tag],
    );
  };

  const submit = async () => {
    const hostName = displayName.trim();
    if (!hostName) {
      setError('Add your display name to post a game.');
      return;
    }

    if (!courtId) {
      setError('Choose a court to post a game.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const group = await createGroup({
        courtId,
        hostName,
        playersNeeded,
        skillLevel,
        durationMinutes,
        tags,
      });

      addGroup({
        ...group,
        courtId,
      });
      navigation.navigate('CourtDetail', { courtId });
    } catch {
      setError('Could not post game.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <View>
              <Text style={styles.eyebrow}>FIND YOUR FOURTH</Text>
              <Text style={styles.title}>Need Players</Text>
              <Text style={styles.subtitle}>Post a game and find players nearby.</Text>
            </View>
            <View style={styles.ball}>
              <Ionicons color={colors.primary} name="tennisball" size={27} />
            </View>
          </View>

          <View style={styles.form}>
            <FieldLabel number="1" text="Display name" />
            <TextInput
              onChangeText={(value) => {
                setDisplayName(value);
                setError('');
              }}
              placeholder="Your name"
              placeholderTextColor="#99A19D"
              style={[styles.input, error ? styles.inputError : undefined]}
              value={displayName}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FieldLabel number="2" text="Choose a court" />
            {loadingCourts ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={styles.stack}>
                {courts.map((court) => {
                  const selected = court.id === courtId;
                  return (
                    <Pressable
                      key={court.id}
                      onPress={() => setCourtId(court.id)}
                      style={[styles.courtOption, selected && styles.courtSelected]}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected ? <View style={styles.radioDot} /> : null}
                      </View>
                      <View style={styles.courtCopy}>
                        <Text style={styles.courtName}>{court.name}</Text>
                        <Text style={styles.courtMeta}>
                          {court.distance} · {court.activePlayers} playing now
                        </Text>
                      </View>
                      {selected ? (
                        <Ionicons
                          color={colors.primary}
                          name="checkmark-circle"
                          size={21}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            )}

            <FieldLabel number="3" text="Players needed" />
            <View style={styles.optionRow}>
              {players.map((value) => (
                <Option
                  key={value}
                  label={String(value)}
                  onPress={() => setPlayersNeeded(value)}
                  selected={playersNeeded === value}
                />
              ))}
            </View>

            <FieldLabel number="4" text="Skill level" />
            <View style={styles.optionRow}>
              {skills.map((value) => (
                <Option
                  compact
                  key={value}
                  label={value}
                  onPress={() => setSkillLevel(value)}
                  selected={skillLevel === value}
                />
              ))}
            </View>

            <FieldLabel number="5" text="How long?" />
            <View style={styles.optionRow}>
              {durations.map((item) => (
                <Option
                  key={item.value}
                  label={item.label}
                  onPress={() => setDurationMinutes(item.value)}
                  selected={durationMinutes === item.value}
                />
              ))}
            </View>

            <FieldLabel number="6" optional text="Set the vibe" />
            <View style={styles.vibes}>
              {vibeOptions.map((tag) => {
                const selected = tags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    style={[styles.vibe, selected && styles.vibeSelected]}
                  >
                    {selected ? (
                      <Ionicons color={colors.primary} name="checkmark" size={14} />
                    ) : null}
                    <Text style={[styles.vibeText, selected && styles.vibeTextSelected]}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              disabled={submitting}
              label={submitting ? 'Posting...' : `Post Game · Need ${playersNeeded}`}
              onPress={submit}
              style={styles.submit}
            />
            <Text style={styles.disclaimer}>
              Your post stays active for the selected duration.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({
  number,
  text,
  optional,
}: {
  number: string;
  text: string;
  optional?: boolean;
}) {
  return (
    <View style={styles.fieldLabel}>
      <View style={styles.step}>
        <Text style={styles.stepText}>{number}</Text>
      </View>
      <Text style={styles.fieldText}>{text}</Text>
      {optional ? <Text style={styles.optional}>OPTIONAL</Text> : null}
    </View>
  );
}

function Option({
  label,
  selected,
  onPress,
  compact,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.optionText,
          compact && styles.optionCompact,
          selected && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  content: { paddingBottom: 36, paddingHorizontal: 18 },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
    marginTop: 7,
  },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5 },
  ball: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    transform: [{ rotate: '10deg' }],
    width: 50,
  },
  form: { marginTop: 8 },
  fieldLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 11,
    marginTop: 23,
  },
  step: {
    alignItems: 'center',
    backgroundColor: colors.softGreen,
    borderRadius: 10,
    height: 21,
    justifyContent: 'center',
    marginRight: 8,
    width: 21,
  },
  stepText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  fieldText: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  optional: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 'auto',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
    height: 54,
    paddingHorizontal: 16,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 10, marginLeft: 3, marginTop: 6 },
  stack: { gap: 8 },
  courtOption: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: 14,
  },
  courtSelected: {
    backgroundColor: colors.softLime,
    borderColor: '#AAC744',
  },
  radio: {
    alignItems: 'center',
    borderColor: '#B9C0BC',
    borderRadius: 9,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    marginRight: 12,
    width: 18,
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  courtCopy: { flex: 1 },
  courtName: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  courtMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  optionCompact: { fontSize: 10 },
  optionTextSelected: { color: '#FFFFFF' },
  vibes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vibe: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  vibeSelected: {
    backgroundColor: colors.softLime,
    borderColor: '#B1CD50',
  },
  vibeText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  vibeTextSelected: { color: colors.primary },
  submit: { marginTop: 30 },
  disclaimer: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 10,
    textAlign: 'center',
  },
});
