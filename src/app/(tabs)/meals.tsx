import { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { useMeals, type MealStatusFilter } from '@/queries/meals';
import { groupMealsByDate, formatTimeLabel } from '@/utils/date';
import type { Meal } from '@/types/api';

const FILTERS: { key: MealStatusFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'on_diet', label: 'Na dieta' },
  { key: 'off_diet', label: 'Fora da dieta' },
];

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

export default function MealsScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<MealStatusFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: meals, isLoading, refetch } = useMeals(status);
  const sections = meals ? groupMealsByDate(meals) : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
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
          <View className="px-6 pt-4 pb-2 gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-sans-bd text-gray1">Refeições</Text>
            </View>

            <Button
              label="Nova refeição"
              icon={<Plus size={18} color="#FFFFFF" />}
              onPress={() => router.push('/meals/new')}
            />

            <View className="flex-row gap-2">
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setStatus(f.key)}
                  className={[
                    'px-4 py-2 rounded-full border',
                    status === f.key ? 'bg-gray1 border-gray1' : 'bg-white border-gray4',
                  ].join(' ')}
                >
                  <Text
                    className={[
                      'text-sm font-sans-md',
                      status === f.key ? 'text-white' : 'text-gray3',
                    ].join(' ')}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
          isLoading ? (
            <ActivityIndicator color="#639339" className="mt-6" />
          ) : (
            <View className="px-6 mt-4">
              <Text className="text-sm text-gray3 text-center">
                Nenhuma refeição encontrada.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
