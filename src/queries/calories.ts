import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { CalorieEstimation } from '@/types/api';

export function useEstimateCalories() {
  return useMutation({
    mutationFn: async (description: string) => {
      const res = await api.post<CalorieEstimation>('/calorie-estimations', { description });
      return res.data;
    },
  });
}

export function useCalorieEstimationHistory() {
  return useQuery({
    queryKey: ['calorie-estimations'],
    queryFn: async () => {
      const res = await api.get<CalorieEstimation[]>('/calorie-estimations');
      return res.data;
    },
  });
}
