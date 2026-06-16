import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { FoodPlanActive } from '@/types/api';

export function useActiveFoodPlan() {
  return useQuery({
    queryKey: ['food-plans', 'active'],
    queryFn: async () => {
      const res = await api.get<FoodPlanActive>('/food-plans/active');
      return res.data;
    },
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}
