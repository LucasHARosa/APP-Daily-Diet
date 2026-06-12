import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

// ── Types & mock data ──────────────────────────────────────────────────────────

interface PlannedMeal {
  id: string;
  time: string;
  name: string;
  calories: number;
  isOnDiet: boolean;
}

interface DayPlan {
  key: string;
  shortName: string;
  fullName: string;
  date: string;
  totalCalories: number;
  meals: PlannedMeal[];
}

const WEEK_PLAN: DayPlan[] = [
  {
    key: 'mon',
    shortName: 'Seg',
    fullName: 'Segunda-feira',
    date: '09/06',
    totalCalories: 1820,
    meals: [
      { id: 'm1', time: '07:00', name: 'Vitamina de banana com aveia', calories: 320, isOnDiet: true },
      { id: 'm2', time: '10:00', name: 'Iogurte grego com mel',        calories: 180, isOnDiet: true },
      { id: 'm3', time: '12:30', name: 'Frango grelhado com arroz',    calories: 580, isOnDiet: true },
      { id: 'm4', time: '16:00', name: 'Castanhas e frutas secas',     calories: 200, isOnDiet: true },
      { id: 'm5', time: '19:30', name: 'Salada com atum e ovos',       calories: 540, isOnDiet: true },
    ],
  },
  {
    key: 'tue',
    shortName: 'Ter',
    fullName: 'Terça-feira',
    date: '10/06',
    totalCalories: 1950,
    meals: [
      { id: 't1', time: '07:30', name: 'Ovos mexidos com torrada',     calories: 350, isOnDiet: true },
      { id: 't2', time: '12:00', name: 'Wrap de frango e legumes',     calories: 480, isOnDiet: true },
      { id: 't3', time: '15:30', name: 'Whey protein com leite',       calories: 280, isOnDiet: true },
      { id: 't4', time: '19:00', name: 'Salmão com batata-doce',       calories: 840, isOnDiet: true },
    ],
  },
  {
    key: 'wed',
    shortName: 'Qua',
    fullName: 'Quarta-feira',
    date: '11/06',
    totalCalories: 2100,
    meals: [
      { id: 'w1', time: '07:00', name: 'Panqueca de aveia com banana', calories: 400, isOnDiet: true },
      { id: 'w2', time: '12:30', name: 'Arroz integral com feijão',    calories: 620, isOnDiet: true },
      { id: 'w3', time: '16:00', name: 'Frutas da estação',            calories: 150, isOnDiet: true },
      { id: 'w4', time: '19:30', name: 'Frango assado com legumes',    calories: 680, isOnDiet: true },
      { id: 'w5', time: '21:30', name: 'X-tudo',                      calories: 250, isOnDiet: false },
    ],
  },
  {
    key: 'thu',
    shortName: 'Qui',
    fullName: 'Quinta-feira',
    date: '12/06',
    totalCalories: 1780,
    meals: [
      { id: 'q1', time: '07:30', name: 'Açaí com granola',            calories: 420, isOnDiet: false },
      { id: 'q2', time: '12:00', name: 'Salada caesar com frango',    calories: 450, isOnDiet: true },
      { id: 'q3', time: '15:00', name: 'Castanhas',                   calories: 130, isOnDiet: true },
      { id: 'q4', time: '19:30', name: 'Macarrão integral com atum',  calories: 780, isOnDiet: true },
    ],
  },
  {
    key: 'fri',
    shortName: 'Sex',
    fullName: 'Sexta-feira',
    date: '13/06',
    totalCalories: 1870,
    meals: [
      { id: 'f1', time: '07:00', name: 'Tapioca com queijo e ovo',    calories: 380, isOnDiet: true },
      { id: 'f2', time: '12:30', name: 'Peixe grelhado com purê',     calories: 590, isOnDiet: true },
      { id: 'f3', time: '16:00', name: 'Iogurte com frutas',          calories: 200, isOnDiet: true },
      { id: 'f4', time: '19:00', name: 'Sopa de legumes com frango',  calories: 700, isOnDiet: true },
    ],
  },
  {
    key: 'sat',
    shortName: 'Sáb',
    fullName: 'Sábado',
    date: '14/06',
    totalCalories: 2250,
    meals: [
      { id: 's1', time: '09:00', name: 'Café da manhã completo',      calories: 650, isOnDiet: true },
      { id: 's2', time: '13:00', name: 'Churrasco com salada',        calories: 900, isOnDiet: false },
      { id: 's3', time: '17:00', name: 'Vitamina de morango',         calories: 250, isOnDiet: true },
      { id: 's4', time: '20:00', name: 'Pizza integral',              calories: 450, isOnDiet: false },
    ],
  },
  {
    key: 'sun',
    shortName: 'Dom',
    fullName: 'Domingo',
    date: '15/06',
    totalCalories: 1690,
    meals: [
      { id: 'd1', time: '09:30', name: 'Panqueca proteica com mel',   calories: 380, isOnDiet: true },
      { id: 'd2', time: '13:30', name: 'Frango ao forno com arroz',   calories: 720, isOnDiet: true },
      { id: 'd3', time: '16:30', name: 'Frutas variadas',             calories: 160, isOnDiet: true },
      { id: 'd4', time: '20:00', name: 'Omelete de legumes',          calories: 430, isOnDiet: true },
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function DayTab({
  day,
  isActive,
  onPress,
}: {
  day: DayPlan;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={[
        'items-center px-3 py-2 rounded-xl',
        isActive ? 'bg-greenDark' : 'bg-white border border-gray5',
      ].join(' ')}
    >
      <Text
        className={[
          'text-xs font-sans-md',
          isActive ? 'text-white' : 'text-gray3',
        ].join(' ')}
      >
        {day.shortName}
      </Text>
      <Text
        className={[
          'text-xs font-sans-bd mt-0.5',
          isActive ? 'text-white' : 'text-gray1',
        ].join(' ')}
      >
        {day.date}
      </Text>
    </TouchableOpacity>
  );
}

function MealItem({ meal }: { meal: PlannedMeal }) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray6">
      <Text className="text-sm text-gray3 w-12">{meal.time}</Text>
      <View className="w-px h-4 bg-gray4" />
      <Text className="flex-1 text-base text-gray1" numberOfLines={1}>
        {meal.name}
      </Text>
      <View className="items-end gap-0.5">
        <Text className="text-xs font-sans-md text-gray2">{meal.calories} kcal</Text>
        <View
          className={[
            'w-2 h-2 rounded-full self-center',
            meal.isOnDiet ? 'bg-greenMid' : 'bg-redMid',
          ].join(' ')}
        />
      </View>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const todayIndex = 2; // Wednesday (mock: matches current week)
  const [activeDay, setActiveDay] = useState(todayIndex);

  const day = WEEK_PLAN[activeDay];
  const onDietCount = day.meals.filter((m) => m.isOnDiet).length;
  const offDietCount = day.meals.length - onDietCount;

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-xl font-sans-bd text-gray1">Plano alimentar</Text>
        <Text className="text-sm text-gray3 mt-0.5">09/06 — 15/06/2025</Text>
      </View>

      {/* Day selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6 py-3 gap-2"
      >
        {WEEK_PLAN.map((d, index) => (
          <DayTab
            key={d.key}
            day={d}
            isActive={index === activeDay}
            onPress={() => setActiveDay(index)}
          />
        ))}
      </ScrollView>

      {/* Day content */}
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Day summary card */}
        <View className="mx-6 mb-4 bg-white rounded-xl p-4 border border-gray5">
          <Text className="text-base font-sans-bd text-gray1 mb-3">{day.fullName}</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 items-center bg-gray6 rounded-lg py-3">
              <Text className="text-xl font-sans-bd text-gray1">{day.totalCalories}</Text>
              <Text className="text-xs text-gray3 mt-0.5">kcal planejadas</Text>
            </View>
            <View className="flex-1 items-center bg-greenLight rounded-lg py-3">
              <Text className="text-xl font-sans-bd text-greenDark">{onDietCount}</Text>
              <Text className="text-xs text-gray3 mt-0.5">na dieta</Text>
            </View>
            <View className="flex-1 items-center bg-redLight rounded-lg py-3">
              <Text className="text-xl font-sans-bd text-redDark">{offDietCount}</Text>
              <Text className="text-xs text-gray3 mt-0.5">fora da dieta</Text>
            </View>
          </View>
        </View>

        {/* Meal list */}
        <View className="mx-6 bg-white rounded-xl px-4 border border-gray5">
          <Text className="text-sm font-sans-bd text-gray3 pt-4 pb-2">
            {day.meals.length} refeições planejadas
          </Text>
          {day.meals.map((meal) => (
            <MealItem key={meal.id} meal={meal} />
          ))}
          {/* Remove bottom border on last item */}
          <View className="h-1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
