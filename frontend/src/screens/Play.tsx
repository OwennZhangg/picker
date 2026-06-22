import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { colors } from '../theme';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'Play'>,
    NativeStackScreenProps<RootStackParamList>
>;

export function PlayScreen({ navigation }: Props) {
    const { activeGroup } = useApp();

    useFocusEffect(
        useCallback(() => {
            if (!activeGroup) {
                return;
            }

            navigation.navigate('GroupDetail', {
                groupId: activeGroup.id,
                courtId: activeGroup.courtId,
            });
        }, [activeGroup, navigation]),
    );

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>PLAY</Text>
                <Text style={styles.title}>Your Game</Text>

                {activeGroup ? (
                    <View style={styles.card}>
                        <View style={styles.icon}>
                            <Ionicons color={colors.primary} name="people" size={24} />
                        </View>
                        <Text style={styles.cardTitle}>{activeGroup.hostName}'s group</Text>
                        <Text style={styles.cardText}>
                            {activeGroup.startsIn} · Need {activeGroup.playersNeeded} more
                        </Text>
                    </View>
                ) : (
                    <View style={styles.empty}>
                        <View style={styles.icon}>
                            <Ionicons color={colors.primary} name="tennisball-outline" size={28} />
                        </View>
                        <Text style={styles.emptyTitle}>No game currently</Text>
                        <Text style={styles.emptyText}>
                            Join a group or post a game to see it here.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { backgroundColor: colors.canvas, flex: 1 },
    content: { flex: 1, paddingHorizontal: 18, paddingTop: 28 },
    eyebrow: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.4,
    },
    title: {
        color: colors.ink,
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -1,
        marginTop: 8,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginTop: 26,
        padding: 20,
    },
    icon: {
        alignItems: 'center',
        backgroundColor: colors.softGreen,
        borderRadius: 24,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    cardTitle: {
        color: colors.ink,
        fontSize: 18,
        fontWeight: '900',
        marginTop: 16,
    },
    cardText: { color: colors.muted, fontSize: 13, marginTop: 6 },
    empty: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginTop: 26,
        padding: 28,
    },
    emptyTitle: {
        color: colors.ink,
        fontSize: 18,
        fontWeight: '900',
        marginTop: 14,
    },
    emptyText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 6,
        textAlign: 'center',
    },
});
