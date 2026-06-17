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
import { useToast } from '@/stores/toast-store';
import { useRegisterMutation } from '@/queries/auth';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: register, isPending } = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await register({ name: data.name, email: data.email, password: data.password });
      toast('Conta criada! Agora faça o login.', 'success');
      router.back();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast('Email já cadastrado.', 'error');
      } else {
        toast('Não foi possível criar a conta. Tente novamente.', 'error');
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
          contentContainerClassName="flex-grow px-6 pt-6 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader subtitle="Crie sua conta" onBack={() => router.back()} />

          <View className="gap-4 mt-10">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Nome"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  placeholder="Seu nome completo"
                  error={errors.name?.message}
                />
              )}
            />

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
                  placeholder="Mínimo 6 caracteres"
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <View className="mt-8">
            <Button
              label="Criar conta"
              onPress={handleSubmit(onSubmit)}
              isLoading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
