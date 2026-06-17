import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'daily_diet_token';
const REFRESH_TOKEN_KEY = 'daily_diet_refresh_token';
const USER_KEY = 'daily_diet_user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  login: async (token, refreshToken, user) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch {
      // expo-secure-store unavailable (web)
    }
    set({ token, refreshToken, user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // expo-secure-store unavailable (web)
    }
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
      if (token) {
        set({ token, refreshToken, user, isAuthenticated: true });
      }
    } catch {
      // expo-secure-store unavailable (web)
    }
  },
}));
