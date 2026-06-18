import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Court } from '../types';

type Props = PropsWithChildren<{
  court: Court;
  height?: number;
}>;

export function CourtArtwork({ court, height = 184, children }: Props) {
  return (
    <LinearGradient colors={court.colors} style={[styles.container, { height }]}>
      <View style={styles.glow} />
      <View style={styles.court}>
        <View style={styles.net} />
        <View style={styles.center} />
      </View>
      <View style={styles.ball}>
        <Text style={styles.holes}>•••</Text>
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    height: 180,
    position: 'absolute',
    right: -40,
    top: -90,
    width: 180,
  },
  court: {
    borderColor: 'rgba(255,255,255,0.28)',
    borderWidth: 2,
    bottom: -28,
    height: 145,
    position: 'absolute',
    right: -8,
    transform: [{ rotate: '-8deg' }],
    width: 225,
  },
  net: {
    borderTopColor: 'rgba(255,255,255,0.28)',
    borderTopWidth: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: '50%',
  },
  center: {
    borderLeftColor: 'rgba(255,255,255,0.28)',
    borderLeftWidth: 2,
    bottom: 0,
    left: '50%',
    position: 'absolute',
    top: 0,
  },
  ball: {
    alignItems: 'center',
    backgroundColor: '#D8F35D',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    right: 28,
    top: 24,
    transform: [{ rotate: '15deg' }],
    width: 34,
  },
  holes: {
    color: 'rgba(23,34,29,0.35)',
    fontSize: 9,
    letterSpacing: 1,
  },
});
