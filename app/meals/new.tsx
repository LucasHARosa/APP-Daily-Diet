import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { useToast } from "@/stores/toast-store";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
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
import { useCreateMeal } from "@/queries/meals";
import { parseFormDateTime } from "@/utils/date";

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  description: z.string().optional(),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
  isOnDiet: z.boolean({ error: "Selecione uma opção" }),
});

type FormData = z.infer<typeof schema>;

// ── Feedback ───────────────────────────────────────────────────────────────────

function FeedbackScreen({
  isOnDiet,
  onGoHome,
}: {
  isOnDiet: boolean;
  onGoHome: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-10 gap-4">
      <Text
        className={[
          "text-3xl font-sans-bd text-center",
          isOnDiet ? "text-greenDark" : "text-redDark",
        ].join(" ")}
      >
        {isOnDiet ? "Continue assim!" : "Que pena!"}
      </Text>

      {isOnDiet ? (
        <Text className="text-base text-gray2 text-center">
          Você continua <Text className="font-sans-bd">dentro da dieta</Text>.
          Muito bem!
        </Text>
      ) : (
        <Text className="text-base text-gray2 text-center">
          Você <Text className="font-sans-bd">saiu da dieta</Text> dessa vez,
          mas continue se esforçando e não desista!
        </Text>
      )}

      <Image
        source={
          isOnDiet
            ? require("@/assets/images/keepgoing.png")
            : require("@/assets/images/ohno.png")
        }
        className="w-64 h-64 mt-4"
        resizeMode="contain"
      />

      <View className="w-full mt-6">
        <Button label="Ir para a página inicial" onPress={onGoHome} />
      </View>
    </SafeAreaView>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function NewMeal() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const { mutateAsync: createMeal, isPending } = useCreateMeal();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", date: "", time: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMeal({
        name: data.name,
        description: data.description || undefined,
        eaten_at: parseFormDateTime(data.date, data.time),
        is_on_diet: data.isOnDiet,
      });
      setSubmitted(data.isOnDiet);
    } catch {
      toast("Erro ao cadastrar refeição. Tente novamente.", "error");
    }
  };

  if (submitted !== null) {
    return (
      <FeedbackScreen
        isOnDiet={submitted}
        onGoHome={() => router.replace("/(tabs)")}
      />
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
          <Text className="text-lg font-sans-bd text-gray1">Nova refeição</Text>
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
          <Button
            label="Cadastrar refeição"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
