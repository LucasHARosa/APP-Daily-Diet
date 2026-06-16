import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Plus } from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';
import { useMeals } from '@/queries/meals';
import { useMetricsSummary } from '@/queries/metrics';
import { groupMealsByDate, formatTimeLabel } from '@/utils/date';
import type { Meal } from '@/types/api';

// ── Sub-components ─────────────────────────────────────────────────────────────

function HomeHeader() {
  const { user } = useAuthStore();
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-2">
        <Image
          source={require('@/assets/images/Logo.png')}
          className="w-8 h-8"
          resizeMode="contain"
        />
        <View>
          <Text className="text-lg font-sans-bd text-gray1 leading-tight">Daily</Text>
          <Text className="text-lg font-sans-bd text-gray1 leading-tight">Diet</Text>
        </View>
      </View>
      <View className="w-11 h-11 rounded-full bg-gray2 items-center justify-center border-2 border-gray1">
        <Text className="text-white text-sm font-sans-bd">{initials}</Text>
      </View>
    </View>
  );
}

function PercentageCard({ percentage }: { percentage: number }) {
  const router = useRouter();
  const isGood = percentage >= 70;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/stats')}
      className={[
        'rounded-lg px-4 py-6 items-center',
        isGood ? 'bg-greenLight' : 'bg-redLight',
      ].join(' ')}
    >
      <ArrowUpRight
        size={20}
        color={isGood ? '#639339' : '#BF3B44'}
        style={{ position: 'absolute', top: 12, right: 12 }}
      />
      <Text
        className={[
          'text-4xl font-sans-bd',
          isGood ? 'text-greenDark' : 'text-redDark',
        ].join(' ')}
      >
        {percentage.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </Text>
      <Text className="text-sm text-gray2 mt-1">
        das refeições dentro da dieta
      </Text>
    </TouchableOpacity>
  );
}

function MealRow({ meal }: { meal: Meal }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/meals/${meal.id}`)}
      className="flex-row items-center bg-white rounded-lg border border-gray5 px-3 py-3 gap-3"
    >
      <Text className="text-sm text-gray3 w-12">{formatTimeLabel(meal.eaten_at)}</Text>
      <View className="w-px h-4 bg-gray4" />
      <Text className="flex-1 text-base text-gray1" numberOfLines={1}>
        {meal.name}
      </Text>
      <View
        className={[
          'w-3 h-3 rounded-full',
          meal.is_on_diet ? 'bg-greenMid' : 'bg-redMid',
        ].join(' ')}
      />
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: meals, isLoading: mealsLoading, refetch: refetchMeals } = useMeals();
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useMetricsSummary();

  const isLoading = mealsLoading || summaryLoading;
  const sections = meals ? groupMealsByDate(meals) : [];
  const percentage = summary?.onDietPercentage ?? 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMeals(), refetchSummary()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top']}>
      <SectionList<Meal, { date: string; data: Meal[] }>
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerClassName="pb-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#639339"
            colors={['#639339']}
          />
        }
        ListHeaderComponent={
          <>
            <HomeHeader />
            <View className="px-6 mb-6">
              {isLoading ? (
                <View className="rounded-lg px-4 py-6 items-center bg-gray6">
                  <ActivityIndicator color="#639339" />
                </View>
              ) : (
                <PercentageCard percentage={percentage} />
              )}
            </View>
            <View className="px-6 mb-2">
              <Text className="text-base font-sans-bd text-gray1 mb-3">
                Refeições
              </Text>
              <Button
                label="Nova refeição"
                icon={<Plus size={18} color="#FFFFFF" />}
                onPress={() => router.push('/meals/new')}
              />
            </View>
          </>
        }
        renderSectionHeader={({ section }) => (
          <View className="px-6">
            <Text className="text-base font-sans-bd text-gray1 mb-2 mt-4">
              {section.date}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-6 mb-2">
            <MealRow meal={item} />
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-6 mt-4">
              <Text className="text-sm text-gray3 text-center">
                Nenhuma refeição registrada ainda.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
