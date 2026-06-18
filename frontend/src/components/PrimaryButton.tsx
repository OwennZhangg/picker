import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  disabled: {
    backgroundColor: '#7E9C8E',
  },
  pressed: {
    opacity: 0.86,
  },
  text: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
});
