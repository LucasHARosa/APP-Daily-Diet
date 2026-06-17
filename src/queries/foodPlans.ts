import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { FoodPlanActive, FoodPlanSummary, FoodPlanMealItem } from '@/types/api';

const notFoundRetry = (failureCount: number, error: unknown) => {
  const axiosError = error as { response?: { status?: number } };
  if (axiosError?.response?.status === 404) return false;
  return failureCount < 1;
};

export function useActiveFoodPlan() {
  return useQuery({
    queryKey: ['food-plans', 'active'],
    queryFn: async () => {
      const res = await api.get<FoodPlanActive>('/food-plans/active');
      return res.data;
    },
    retry: notFoundRetry,
  });
}

export function useFoodPlans() {
  return useQuery({
    queryKey: ['food-plans'],
    queryFn: async () => {
      const res = await api.get<FoodPlanSummary[]>('/food-plans');
      return res.data;
    },
  });
}

export function useFoodPlan(id: string) {
  return useQuery({
    queryKey: ['food-plans', id],
    queryFn: async () => {
      const res = await api.get<FoodPlanActive>(`/food-plans/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: notFoundRetry,
  });
}

function invalidatePlans(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['food-plans'] });
}

export function useCreateFoodPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const res = await api.post<FoodPlanSummary>('/food-plans', data);
      return res.data;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

export function useUpdateFoodPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; title: string; description?: string }) => {
      const res = await api.put<FoodPlanSummary>(`/food-plans/${id}`, data);
      return res.data;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

export function useSetFoodPlanActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await api.patch<FoodPlanSummary>(`/food-plans/${id}/active`, {
        is_active: isActive,
      });
      return res.data;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

export function useDeleteFoodPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/food-plans/${id}`);
      return id;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

type MealItemInput = {
  name: string;
  description?: string;
  scheduled_time?: string;
  calories?: number;
  sort_order: number;
};

export function useAddMealToDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      weekday,
      ...data
    }: MealItemInput & { planId: string; weekday: number }) => {
      const res = await api.post<FoodPlanMealItem>(
        `/food-plans/${planId}/days/${weekday}/meals`,
        data,
      );
      return res.data;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

export function useUpdateMealItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mealId, ...data }: MealItemInput & { mealId: string }) => {
      const res = await api.put<FoodPlanMealItem>(`/food-plan-meals/${mealId}`, data);
      return res.data;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

export function useDeleteMealItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: string) => {
      await api.delete(`/food-plan-meals/${mealId}`);
      return mealId;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}
