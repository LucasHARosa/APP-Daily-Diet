import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from '@/components/Button';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { TextField } from '@/components/auth/TextField';
import { PasswordField } from '@/components/auth/PasswordField';
import { AuthFooterLink } from '@/components/auth/AuthFooterLink';
import { useToast } from '@/stores/toast-store';
import { useLoginMutation } from '@/queries/auth';

const schema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast('Bem-vindo de volta!', 'success');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast('Email ou senha incorretos.', 'error');
      } else {
        toast('Não foi possível conectar. Tente novamente.', 'error');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pt-10 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader subtitle="Acesse sua conta" />

          <View className="gap-4 mt-10">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="E-mail"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="seuemail@exemplo.com"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordField
                  label="Senha"
                  value={value}
                  onChangeText={onChange}
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <View className="mt-8">
            <Button
              label="Entrar"
              onPress={handleSubmit(onSubmit)}
              isLoading={isPending}
            />
          </View>

          <AuthFooterLink
            question="Ainda não tem conta?"
            actionLabel="Criar conta"
            onPress={() => router.push('/(auth)/sign-up')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
