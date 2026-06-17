import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/Button";
import { DietToggle } from "@/components/DietToggle";
import { Input } from "@/components/Input";
import { useToast } from "@/stores/toast-store";
import { useMeal, useUpdateMeal } from "@/queries/meals";
import { useEstimateCalories } from "@/queries/calories";
import { parseFormDateTime, formatDateForForm, formatTimeLabel } from "@/utils/date";

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  description: z.string().optional(),
  calories: z.string().optional(),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
  isOnDiet: z.boolean({ error: "Selecione uma opção" }),
});

type FormData = z.infer<typeof schema>;

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function EditMeal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const { data: meal, isLoading } = useMeal(id);
  const { mutateAsync: updateMeal, isPending } = useUpdateMeal();
  const { mutateAsync: estimateCalories, isPending: isEstimating } = useEstimateCalories();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", calories: "", date: "", time: "", isOnDiet: true },
  });

  useEffect(() => {
    if (meal) {
      reset({
        name: meal.name,
        description: meal.description ?? "",
        calories: meal.calories != null ? String(meal.calories) : "",
        date: formatDateForForm(meal.eaten_at),
        time: formatTimeLabel(meal.eaten_at),
        isOnDiet: meal.is_on_diet,
      });
    }
  }, [meal]);

  const handleEstimate = async () => {
    const description = getValues("description");
    if (!description) {
      toast("Escreva uma descrição para estimar as calorias.", "info");
      return;
    }
    try {
      const result = await estimateCalories(description);
      setValue("calories", String(result.estimated_calories));
      toast(`Estimativa: ${result.estimated_calories} kcal (${result.confidence})`, "success");
    } catch {
      toast("Não foi possível estimar as calorias agora.", "error");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await updateMeal({
        id,
        name: data.name,
        description: data.description || undefined,
        calories: data.calories ? Number(data.calories) : undefined,
        eaten_at: parseFormDateTime(data.date, data.time),
        is_on_diet: data.isOnDiet,
      });
      router.back();
    } catch {
      toast("Erro ao salvar alterações. Tente novamente.", "error");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray7 items-center justify-center">
        <ActivityIndicator color="#639339" />
      </SafeAreaView>
    );
  }

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

          {/* Calorias */}
          <Controller
            control={control}
            name="calories"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Calorias (kcal)"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="0"
                rightElement={
                  <TouchableOpacity
                    onPress={handleEstimate}
                    disabled={isEstimating}
                    className="flex-row items-center gap-1"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {isEstimating ? (
                      <ActivityIndicator size="small" color="#639339" />
                    ) : (
                      <>
                        <Sparkles size={16} color="#639339" />
                        <Text className="text-xs font-sans-sb text-greenDark">
                          Estimar com IA
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                }
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
          <Button
            label="Salvar alterações"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
