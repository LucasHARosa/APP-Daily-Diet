import {
  View,
  Text,
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
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import axios from 'axios';

import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
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
  const [showPassword, setShowPassword] = useState(false);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={24} color="#1B1D1E" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-sans-bd text-gray1 -ml-8">
            Nova conta
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="px-6 pt-4 pb-10 gap-4"
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome */}
          <View className="gap-1">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  placeholder="Seu nome completo"
                />
              )}
            />
            {errors.name && (
              <Text className="text-xs text-redDark">{errors.name.message}</Text>
            )}
          </View>

          {/* E-mail */}
          <View className="gap-1">
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
              <Text className="text-xs text-redDark">{errors.email.message}</Text>
            )}
          </View>

          {/* Senha com toggle */}
          <View className="gap-1">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Senha"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  placeholder="Mínimo 6 caracteres"
                  rightElement={
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color="#5C6265" />
                      ) : (
                        <Eye size={18} color="#5C6265" />
                      )}
                    </TouchableOpacity>
                  }
                />
              )}
            />
            {errors.password && (
              <Text className="text-xs text-redDark">{errors.password.message}</Text>
            )}
          </View>

          <View className="mt-2">
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
