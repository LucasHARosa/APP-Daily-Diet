import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Button } from "@/components/Button";
import { DietToggle } from "@/components/DietToggle";
import { Input } from "@/components/Input";

// ── Mock data (mesma do detail) ────────────────────────────────────────────────

const MOCK_MEALS: Record<
  string,
  {
    name: string;
    description: string;
    date: string;
    time: string;
    isOnDiet: boolean;
  }
> = {
  "1": {
    name: "X-tudo",
    description: "Xis completo da lancheria do bairro",
    date: "12/08/2022",
    time: "20:00",
    isOnDiet: false,
  },
  "2": {
    name: "Whey protein com leite",
    description: "Whey protein com leite integral",
    date: "12/08/2022",
    time: "16:00",
    isOnDiet: true,
  },
  "3": {
    name: "Salada cesar com frango",
    description: "Salada cesar com frango grelhado",
    date: "12/08/2022",
    time: "12:30",
    isOnDiet: true,
  },
  "4": {
    name: "Vitamina de banana com aveia",
    description: "Vitamina de banana com aveia e mel",
    date: "12/08/2022",
    time: "09:30",
    isOnDiet: true,
  },
};

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  description: z.string().optional(),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
  isOnDiet: z.boolean({ error: "Selecione uma opção" }),
});

type FormData = z.infer<typeof schema>;

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function EditMeal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const meal = MOCK_MEALS[id];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: meal?.name ?? "",
      description: meal?.description ?? "",
      date: meal?.date ?? "",
      time: meal?.time ?? "",
      isOnDiet: meal?.isOnDiet,
    },
  });

  const onSubmit = (_data: FormData) => {
    // Mock: navega de volta para o detalhe
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={24} color="#1B1D1E" />
          </TouchableOpacity>
          <Text className="text-lg font-sans-bd text-gray1">
            Editar refeição
          </Text>
          <View className="w-8" />
        </View>

        {/* Form card */}
        <ScrollView
          className="flex-1 bg-white rounded-t-3xl"
          contentContainerClassName="px-6 pt-8 pb-6 gap-5"
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome */}
          <View className="gap-1">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input label="Nome" value={value} onChangeText={onChange} />
              )}
            />
            {errors.name && (
              <Text className="text-xs text-redDark">
                {errors.name.message}
              </Text>
            )}
          </View>

          {/* Descrição */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Descrição"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                style={{ minHeight: 120 }}
              />
            )}
          />

          {/* Data + Hora */}
          <View className="flex-row gap-4">
            <View className="flex-1 gap-1">
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Data"
                    value={value}
                    onChangeText={onChange}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.date && (
                <Text className="text-xs text-redDark">
                  {errors.date.message}
                </Text>
              )}
            </View>

            <View className="flex-1 gap-1">
              <Controller
                control={control}
                name="time"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Hora"
                    value={value}
                    onChangeText={onChange}
                    placeholder="HH:MM"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.time && (
                <Text className="text-xs text-redDark">
                  {errors.time.message}
                </Text>
              )}
            </View>
          </View>

          {/* Dieta toggle */}
          <View className="gap-2">
            <Text className="text-sm font-sans-md text-gray2">
              Está dentro da dieta?
            </Text>
            <Controller
              control={control}
              name="isOnDiet"
              render={({ field: { onChange, value } }) => (
                <DietToggle value={value ?? null} onChange={onChange} />
              )}
            />
            {errors.isOnDiet && (
              <Text className="text-xs text-redDark">
                {errors.isOnDiet.message}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Submit button */}
        <View className="px-6 py-4 bg-white">
          <Button label="Salvar alterações" onPress={handleSubmit(onSubmit)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
