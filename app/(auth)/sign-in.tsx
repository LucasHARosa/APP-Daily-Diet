import { useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/stores/auth-store';

const schema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    await login('mock-token-daily-diet', {
      id: '1',
      name: 'Lucas',
      email: data.email,
    });
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-between px-6 pt-16 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center gap-2">
            <Image
              source={require('@/assets/images/Logo.png')}
              className="w-20 h-20"
              resizeMode="contain"
            />
            <View className="items-center">
              <Text className="text-3xl font-sans-bd text-gray1 leading-tight">
                Daily
              </Text>
              <Text className="text-3xl font-sans-bd text-gray1 leading-tight">
                Diet
              </Text>
            </View>
          </View>

          <View className="gap-6 mt-16">
            <Text className="text-xl font-sans-bd text-gray1 text-center">
              Acesse sua conta
            </Text>

            <View className="gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="E-mail"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="seuemail@exemplo.com"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-xs text-redDark -mt-2">
                  {errors.email.message}
                </Text>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Senha"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholder="••••••••"
                  />
                )}
              />
              {errors.password && (
                <Text className="text-xs text-redDark -mt-2">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <Button
              label="Entrar"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          </View>

          <View className="items-center mt-12 gap-1">
            <Text className="text-sm text-gray3">Ainda não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-sm font-sans-sb text-gray1 underline">
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
