import '@/global.css';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '@/services/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { Toast } from '@/components/Toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, hydrate } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular: require('@expo-google-fonts/nunito-sans/400Regular/NunitoSans_400Regular.ttf'),
    NunitoSans_500Medium: require('@expo-google-fonts/nunito-sans/500Medium/NunitoSans_500Medium.ttf'),
    NunitoSans_600SemiBold: require('@expo-google-fonts/nunito-sans/600SemiBold/NunitoSans_600SemiBold.ttf'),
    NunitoSans_700Bold: require('@expo-google-fonts/nunito-sans/700Bold/NunitoSans_700Bold.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    hydrate().then(() => setIsReady(true));
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync();
    const inAuth = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isReady]);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
