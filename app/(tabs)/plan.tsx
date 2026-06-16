import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { useActiveFoodPlan } from '@/queries/foodPlans';
import type { FoodPlanDay, FoodPlanMealItem } from '@/types/api';

// ── Helpers ────────────────────────────────────────────────────────────────────

const DAY_SHORT_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function getTodayApiWeekday(): number {
  // JS: 0=Dom, 1=Seg … 6=Sab → API: 0=Seg … 6=Dom
  const jsDay = new Date().getDay();
  return (jsDay + 6) % 7;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function DayTab({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={[
        'items-center px-4 py-2 rounded-xl',
        isActive ? 'bg-greenDark' : 'bg-white border border-gray5',
      ].join(' ')}
    >
      <Text
        className={[
          'text-xs font-sans-bd',
          isActive ? 'text-white' : 'text-gray1',
        ].join(' ')}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MealItem({ meal }: { meal: FoodPlanMealItem }) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray6">
      <Text className="text-sm text-gray3 w-12">{meal.scheduled_time ?? '--:--'}</Text>
      <View className="w-px h-4 bg-gray4" />
      <Text className="flex-1 text-base text-gray1" numberOfLines={1}>
        {meal.name}
      </Text>
      {meal.calories != null && (
        <Text className="text-xs font-sans-md text-gray2">{meal.calories} kcal</Text>
      )}
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const todayIndex = getTodayApiWeekday();
  const [activeDay, setActiveDay] = useState(todayIndex);

  const { data: plan, isLoading, error } = useActiveFoodPlan();

  const noActivePlan =
    !isLoading &&
    (!plan || (error as { response?: { status?: number } } | null)?.response?.status === 404);

  const day: FoodPlanDay | undefined = plan?.days.find((d) => d.weekday === activeDay);
  const onDietCount = 0; // food plan meals don't have is_on_diet
  const offDietCount = 0;
  const totalCalories = day?.meals.reduce((sum, m) => sum + (m.calories ?? 0), 0) ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-xl font-sans-bd text-gray1">Plano alimentar</Text>
        {plan && (
          <Text className="text-sm text-gray3 mt-0.5">{plan.title}</Text>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#639339" />
        </View>
      ) : noActivePlan ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base text-gray3 text-center">
            Nenhum plano ativo no momento.
          </Text>
          <Text className="text-sm text-gray4 text-center mt-2">
            Crie um plano alimentar e ative-o para visualizar aqui.
          </Text>
        </View>
      ) : (
        <>
          {/* Day selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-6 py-3 gap-2"
          >
            {DAY_SHORT_NAMES.map((name, index) => (
              <DayTab
                key={index}
                label={name}
                isActive={index === activeDay}
                onPress={() => setActiveDay(index)}
              />
            ))}
          </ScrollView>

          {/* Day content */}
          <ScrollView className="flex-1" contentContainerClassName="pb-8">
            {/* Day summary card */}
            <View className="mx-6 mb-4 bg-white rounded-xl p-4 border border-gray5">
              <Text className="text-base font-sans-bd text-gray1 mb-3">
                {day?.weekday_name ?? DAY_SHORT_NAMES[activeDay]}
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 items-center bg-gray6 rounded-lg py-3">
                  <Text className="text-xl font-sans-bd text-gray1">{totalCalories}</Text>
                  <Text className="text-xs text-gray3 mt-0.5">kcal planejadas</Text>
                </View>
                <View className="flex-1 items-center bg-greenLight rounded-lg py-3">
                  <Text className="text-xl font-sans-bd text-greenDark">
                    {day?.meals.length ?? 0}
                  </Text>
                  <Text className="text-xs text-gray3 mt-0.5">refeições</Text>
                </View>
              </View>
            </View>

            {/* Meal list */}
            <View className="mx-6 bg-white rounded-xl px-4 border border-gray5">
              {!day || day.meals.length === 0 ? (
                <Text className="text-sm text-gray3 py-6 text-center">
                  Nenhuma refeição planejada para este dia.
                </Text>
              ) : (
                <>
                  <Text className="text-sm font-sans-bd text-gray3 pt-4 pb-2">
                    {day.meals.length} refeições planejadas
                  </Text>
                  {day.meals.map((meal) => (
                    <MealItem key={meal.id} meal={meal} />
                  ))}
                  <View className="h-1" />
                </>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
