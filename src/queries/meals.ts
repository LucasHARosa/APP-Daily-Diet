import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Meal } from '@/types/api';

export function useMeals() {
  return useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const res = await api.get<Meal[]>('/meals');
      return res.data;
    },
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ['meals', id],
    queryFn: async () => {
      const res = await api.get<Meal>(`/meals/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      eaten_at: string;
      is_on_diet: boolean;
      calories?: number;
    }) => {
      const res = await api.post<Meal>('/meals', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name: string;
      description?: string;
      eaten_at: string;
      is_on_diet: boolean;
      calories?: number;
    }) => {
      const res = await api.put<Meal>(`/meals/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meals', data.id] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
