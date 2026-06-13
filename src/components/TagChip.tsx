import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function TagChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.softGreen,
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  text: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
