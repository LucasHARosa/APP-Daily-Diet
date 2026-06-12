import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_PERCENTAGE = 90.86;

const GENERAL_STATS = {
  bestStreak: 7,
  currentStreak: 3,
  totalMeals: 47,
  onDietCount: 36,
  offDietCount: 11,
};

const PERIOD_STATS = {
  today:   { onDiet: 3,  offDiet: 1,  bestDay: 'Hoje',       worstDay: '—' },
  '7days': { onDiet: 22, offDiet: 6,  bestDay: '12/08/2022', worstDay: '10/08/2022' },
  '30days':{ onDiet: 36, offDiet: 11, bestDay: '12/08/2022', worstDay: '05/08/2022' },
  custom:  { onDiet: 36, offDiet: 11, bestDay: '12/08/2022', worstDay: '05/08/2022' },
};

type Period = keyof typeof PERIOD_STATS;

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today',   label: 'Hoje' },
  { key: '7days',   label: '7 dias' },
  { key: '30days',  label: '30 dias' },
  { key: 'custom',  label: 'Personalizado' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  highlight,
  fullWidth,
}: {
  label: string;
  value: string;
  highlight?: 'green' | 'red';
  fullWidth?: boolean;
}) {
  const bg =
    highlight === 'green' ? 'bg-greenLight' :
    highlight === 'red'   ? 'bg-redLight'   : 'bg-gray6';
  const valueColor =
    highlight === 'green' ? 'text-greenDark' :
    highlight === 'red'   ? 'text-redDark'   : 'text-gray1';

  return (
    <View className={[fullWidth ? 'w-full' : 'flex-1', 'rounded-lg p-4 gap-1', bg].join(' ')}>
      <Text className={['text-2xl font-sans-bd', valueColor].join(' ')}>{value}</Text>
      <Text className="text-xs text-gray3">{label}</Text>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function StatsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7days');

  const isGood = MOCK_PERCENTAGE >= 70;
  const stats = PERIOD_STATS[period];

  const headerBg    = isGood ? 'bg-greenLight' : 'bg-redLight';
  const accentColor = isGood ? 'text-greenDark' : 'text-redDark';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      {/* Colored header */}
      <View className={['px-4 pt-12 pb-8', headerBg].join(' ')}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6 self-start p-1 -ml-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#1B1D1E" />
        </TouchableOpacity>

        <Text className={['text-5xl font-sans-bd text-center', accentColor].join(' ')}>
          {MOCK_PERCENTAGE.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%
        </Text>
        <Text className="text-sm text-gray2 text-center mt-1">
          das refeições dentro da dieta
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-6 pt-6 pb-8 gap-8">
        {/* General stats */}
        <View className="gap-3">
          <Text className="text-base font-sans-bd text-gray1">Estatísticas gerais</Text>

          <View className="flex-row gap-3">
            <MetricCard
              label="melhor sequência"
              value={`${GENERAL_STATS.bestStreak} dias`}
              highlight="green"
            />
            <MetricCard
              label="sequência atual"
              value={`${GENERAL_STATS.currentStreak} dias`}
            />
          </View>

          <MetricCard
            label="refeições registradas"
            value={String(GENERAL_STATS.totalMeals)}
            fullWidth
          />

          <View className="flex-row gap-3">
            <MetricCard
              label="dentro da dieta"
              value={String(GENERAL_STATS.onDietCount)}
              highlight="green"
            />
            <MetricCard
              label="fora da dieta"
              value={String(GENERAL_STATS.offDietCount)}
              highlight="red"
            />
          </View>
        </View>

        {/* Period breakdown */}
        <View className="gap-3">
          <Text className="text-base font-sans-bd text-gray1">Refeições por período</Text>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p.key}
                onPress={() => setPeriod(p.key)}
                className={[
                  'px-4 py-2 rounded-full border',
                  period === p.key ? 'bg-gray1 border-gray1' : 'bg-white border-gray4',
                ].join(' ')}
              >
                <Text
                  className={[
                    'text-sm font-sans-md',
                    period === p.key ? 'text-white' : 'text-gray3',
                  ].join(' ')}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Period metrics */}
          <View className="flex-row gap-3">
            <MetricCard
              label="dentro da dieta"
              value={String(stats.onDiet)}
              highlight="green"
            />
            <MetricCard
              label="fora da dieta"
              value={String(stats.offDiet)}
              highlight="red"
            />
          </View>

          <View className="flex-row gap-3">
            <MetricCard label="melhor dia" value={stats.bestDay} />
            <MetricCard label="pior dia"   value={stats.worstDay} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
