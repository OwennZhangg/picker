import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { fetchCourt } from '../config/api';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { Court } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

export function GroupDetail({ navigation, route }: Props) {
    const { activeGroup, leaveGroup } = useApp();
    const params = route.params;
    const [court, setCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!params?.courtId) {
            setLoading(false);
            return;
        }

        async function loadCourt() {
            try {
                setCourt(await fetchCourt(params.courtId));
            } finally {
                setLoading(false);
            }
        }

        loadCourt();
    }, [params?.courtId]);

    if (!params) {
        return (
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.content}>
                    <Pressable
                        onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
                        style={styles.backButton}
                    >
                        <Ionicons color={colors.ink} name="arrow-back" size={21} />
                    </Pressable>
                    <Text style={styles.title}>Group not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content}>
                <Pressable
                    onPress={() =>
                        navigation.navigate('CourtDetail', {
                            courtId: params.courtId,
                        })
                    }
                    style={styles.backButton}
                >
                    <Ionicons color={colors.ink} name="arrow-back" size={21} />
                </Pressable>

                {loading ? (
                    <ActivityIndicator color={colors.primary} />
                ) : (
                    <>
                        <Text style={styles.eyebrow}>GROUP DETAIL</Text>
                        <Text style={styles.title}>{court?.name ?? 'Group'}</Text>
                        <Text style={styles.subtitle}>
                            Group {params.groupId} · {activeGroup?.startsIn ?? 'Starting soon'}
                        </Text>

                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Host</Text>
                            <Text style={styles.cardValue}>{activeGroup?.hostName ?? 'Player'}</Text>
                            <Text style={styles.cardLabel}>Players needed</Text>
                            <Text style={styles.cardValue}>{activeGroup?.playersNeeded ?? 0}</Text>
                        </View>

                        <PrimaryButton
                            label="Back to court"
                            onPress={() =>
                                navigation.navigate('CourtDetail', {
                                    courtId: params.courtId,
                                })
                            }
                            style={styles.button}
                        />
                        <PrimaryButton
                            label="Leave group"
                            onPress={async () => {
                                await leaveGroup();
                                navigation.navigate('Tabs', { screen: 'Play' });
                            }}
                            style={styles.button}
                        />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { backgroundColor: colors.canvas, flex: 1 },
    content: { padding: 18 },
    backButton: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderColor: colors.line,
        borderRadius: 19,
        borderWidth: 1,
        height: 38,
        justifyContent: 'center',
        width: 38,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.4,
        marginTop: 34,
    },
    title: {
        color: colors.ink,
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -1.1,
        marginTop: 8,
    },
    subtitle: { color: colors.muted, fontSize: 13, marginTop: 6 },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        marginTop: 28,
        padding: 18,
    },
    cardLabel: {
        color: colors.muted,
        fontSize: 10,
        fontWeight: '800',
        marginTop: 12,
    },
    cardValue: {
        color: colors.ink,
        fontSize: 18,
        fontWeight: '900',
        marginTop: 4,
    },
    button: { marginTop: 24 },
});
