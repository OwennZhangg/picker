import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export function OnboardingScreen() {
  const { createProfile } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const name = displayName.trim();

    if (!name) {
      setError('Enter your name to continue.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await createProfile(name);
    } catch {
      setError('Could not create profile.');
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
        <View style={styles.content}>
          <View style={styles.logo}>
            <Ionicons color={colors.primary} name="tennisball" size={34} />
          </View>

          <Text style={styles.eyebrow}>WELCOME TO PICKER</Text>
          <Text style={styles.title}>What should players call you?</Text>
          <Text style={styles.subtitle}>
            This name shows when you post or join a game.
          </Text>

          <TextInput
            autoCapitalize="words"
            autoFocus
            onChangeText={(value) => {
              setDisplayName(value);
              setError('');
            }}
            onSubmitEditing={submit}
            placeholder="Your name"
            placeholderTextColor="#99A19D"
            returnKeyType="done"
            style={[styles.input, error ? styles.inputError : undefined]}
            value={displayName}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            disabled={submitting}
            label={submitting ? 'Creating profile...' : 'Continue'}
            onPress={submit}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: colors.canvas, flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 28,
    transform: [{ rotate: '-8deg' }],
    width: 56,
  },
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
    letterSpacing: -1.1,
    lineHeight: 39,
    marginTop: 10,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
    height: 56,
    marginTop: 34,
    paddingHorizontal: 16,
  },
  inputError: { borderColor: colors.error },
  error: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
  button: { marginTop: 24 },
});
