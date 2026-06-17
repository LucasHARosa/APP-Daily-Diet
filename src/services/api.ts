import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginResponse } from '@/types/api';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, user, login, logout } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    const res = await axios.post<LoginResponse>(`${baseURL}/sessions/refresh`, {
      refresh_token: refreshToken,
    });
    const data = res.data;
    await login(data.access_token, data.refresh_token, user ?? data.user);
    return data.access_token;
  } catch {
    await logout();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/sessions') || originalRequest?.url?.includes('/users');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
