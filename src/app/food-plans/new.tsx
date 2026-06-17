import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/stores/toast-store';
import { useCreateFoodPlan } from '@/queries/foodPlans';

const schema = z.object({
  title: z.string().min(1, 'Informe um título'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewFoodPlanScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: createPlan, isPending } = useCreateFoodPlan();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const plan = await createPlan({
        title: data.title,
        description: data.description || undefined,
      });
      router.replace(`/food-plans/${plan.id}`);
    } catch {
      toast('Erro ao criar plano. Tente novamente.', 'error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={24} color="#1B1D1E" />
          </TouchableOpacity>
          <Text className="text-lg font-sans-bd text-gray1">Novo plano</Text>
          <View className="w-8" />
        </View>

        <ScrollView
          className="flex-1 bg-white rounded-t-3xl"
          contentContainerClassName="px-6 pt-8 pb-6 gap-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-1">
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Título"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: Plano Semana 1"
                />
              )}
            />
            {errors.title && (
              <Text className="text-xs text-redDark">{errors.title.message}</Text>
            )}
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Descrição"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
              />
            )}
          />
        </ScrollView>

        <View className="px-6 py-4 bg-white">
          <Button label="Criar plano" onPress={handleSubmit(onSubmit)} isLoading={isPending} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
