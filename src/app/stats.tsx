import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMetricsSummary, useMetricsByPeriod } from '@/queries/metrics';
import { formatISODate } from '@/utils/date';
import type { MetricsPeriodGroup } from '@/types/api';

// ── Types ──────────────────────────────────────────────────────────────────────

type Period = 'today' | '7days' | '30days';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today',  label: 'Hoje' },
  { key: '7days',  label: '7 dias' },
  { key: '30days', label: '30 dias' },
];

function getPeriodRange(period: Period): { start: string; end: string } {
  const today = new Date();
  const end = formatISODate(today);

  if (period === 'today') {
    return { start: end, end };
  }
  const days = period === '7days' ? 7 : 30;
  const start = new Date(today);
  start.setDate(start.getDate() - days);
  return { start: formatISODate(start), end };
}

function bestDay(groups: MetricsPeriodGroup[]): string {
  if (!groups.length) return '—';
  const best = groups.reduce((a, b) => (b.totalOnDiet > a.totalOnDiet ? b : a));
  return best.totalOnDiet > 0 ? best.date : '—';
}

function worstDay(groups: MetricsPeriodGroup[]): string {
  if (!groups.length) return '—';
  const worst = groups.reduce((a, b) => (b.totalOffDiet > a.totalOffDiet ? b : a));
  return worst.totalOffDiet > 0 ? worst.date : '—';
}

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

  const { data: summary, isLoading: summaryLoading } = useMetricsSummary();
  const { start, end } = getPeriodRange(period);
  const { data: periodData, isLoading: periodLoading } = useMetricsByPeriod(start, end);

  const percentage = summary?.onDietPercentage ?? 0;
  const isGood = percentage >= 70;

  const headerBg    = isGood ? 'bg-greenLight' : 'bg-redLight';
  const accentColor = isGood ? 'text-greenDark' : 'text-redDark';

  const groups = periodData?.groups ?? [];
  const periodSummary = periodData?.summary;

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

        {summaryLoading ? (
          <ActivityIndicator color="#639339" className="my-4" />
        ) : (
          <>
            <Text className={['text-5xl font-sans-bd text-center', accentColor].join(' ')}>
              {percentage.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}%
            </Text>
            <Text className="text-sm text-gray2 text-center mt-1">
              das refeições dentro da dieta
            </Text>
          </>
        )}
      </View>

      <ScrollView contentContainerClassName="px-6 pt-6 pb-8 gap-8">
        {/* General stats */}
        <View className="gap-3">
          <Text className="text-base font-sans-bd text-gray1">Estatísticas gerais</Text>

          {summaryLoading ? (
            <ActivityIndicator color="#639339" />
          ) : (
            <>
              <View className="flex-row gap-3">
                <MetricCard
                  label="melhor sequência"
                  value={`${summary?.bestOnDietSequence ?? 0} dias`}
                  highlight="green"
                />
                <MetricCard
                  label="refeições registradas"
                  value={String(summary?.totalMeals ?? 0)}
                />
              </View>

              <View className="flex-row gap-3">
                <MetricCard
                  label="dentro da dieta"
                  value={String(summary?.totalOnDiet ?? 0)}
                  highlight="green"
                />
                <MetricCard
                  label="fora da dieta"
                  value={String(summary?.totalOffDiet ?? 0)}
                  highlight="red"
                />
              </View>
            </>
          )}
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
          {periodLoading ? (
            <ActivityIndicator color="#639339" />
          ) : (
            <>
              <View className="flex-row gap-3">
                <MetricCard
                  label="dentro da dieta"
                  value={String(periodSummary?.totalOnDiet ?? 0)}
                  highlight="green"
                />
                <MetricCard
                  label="fora da dieta"
                  value={String(periodSummary?.totalOffDiet ?? 0)}
                  highlight="red"
                />
              </View>

              <View className="flex-row gap-3">
                <MetricCard label="melhor dia" value={bestDay(groups)} />
                <MetricCard label="pior dia"   value={worstDay(groups)} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
