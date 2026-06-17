import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Profile, UpdateProfileInput } from '@/types/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<Profile>('/me/profile');
      return res.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await api.patch<Profile>('/me/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
}
