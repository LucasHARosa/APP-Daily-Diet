import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { MetricsSummary, MetricsPeriodResponse } from '@/types/api';

export function useMetricsSummary() {
  return useQuery({
    queryKey: ['metrics', 'summary'],
    queryFn: async () => {
      const res = await api.get<MetricsSummary>('/metrics/summary');
      return res.data;
    },
  });
}

export function useMetricsByPeriod(start: string, end: string) {
  return useQuery({
    queryKey: ['metrics', 'period', start, end],
    queryFn: async () => {
      const res = await api.get<MetricsPeriodResponse>('/metrics', {
        params: { start, end, groupBy: 'day' },
      });
      return res.data;
    },
    enabled: !!start && !!end,
  });
}
