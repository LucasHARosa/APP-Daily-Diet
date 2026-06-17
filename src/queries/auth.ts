import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore, type AuthUser } from '@/stores/auth-store';
import type { LoginResponse } from '@/types/api';

export function useLoginMutation() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<LoginResponse>('/sessions', data);
      return res.data;
    },
    onSuccess: async (data) => {
      const user: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      };
      await login(data.access_token, data.refresh_token, user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post('/users', data);
      return res.data;
    },
  });
}
