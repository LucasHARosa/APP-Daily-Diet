import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react-native";
import { Alert, ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { useToast } from "@/stores/toast-store";
import { useMeal, useDeleteMeal } from "@/queries/meals";
import { formatDateForForm, formatTimeLabel } from "@/utils/date";

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function MealDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const { data: meal, isLoading } = useMeal(id);
  const { mutateAsync: deleteMeal, isPending: isDeleting } = useDeleteMeal();

  const isOnDiet = meal?.is_on_diet ?? true;
  const headerBg = isOnDiet ? "bg-greenLight" : "bg-redLight";
  const badgeColor = isOnDiet ? "bg-greenDark" : "bg-redDark";
  const badgeText = isOnDiet ? "dentro da dieta" : "fora da dieta";
  const badgeTextColor = isOnDiet ? "text-greenDark" : "text-redDark";

  const handleDelete = () => {
    Alert.alert(
      "Excluir refeição",
      "Deseja realmente excluir o registro da refeição?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(id);
              toast("Refeição excluída.", "info");
              router.replace("/(tabs)");
            } catch {
              toast("Erro ao excluir refeição.", "error");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Colored header area */}
      <View className={["px-4 pt-12 pb-8", headerBg].join(" ")}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6 self-start p-1 -ml-1"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#1B1D1E" />
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator color="#639339" className="my-4" />
        ) : (
          <>
            <Text className="text-2xl font-sans-bd text-gray1 mb-1">
              {meal?.name}
            </Text>
            {meal?.description ? (
              <Text className="text-base text-gray2 mb-6">{meal.description}</Text>
            ) : null}

            <Text className="text-sm font-sans-bd text-gray1 mb-1">
              Data e hora
            </Text>
            <Text className="text-base text-gray2 mb-6">
              {meal ? `${formatDateForForm(meal.eaten_at)} às ${formatTimeLabel(meal.eaten_at)}` : ''}
            </Text>

            <View className="flex-row items-center gap-2 self-start bg-gray6 px-3 py-1 rounded-full">
              <View className={["w-2 h-2 rounded-full", badgeColor].join(" ")} />
              <Text className={["text-sm font-sans-md", badgeTextColor].join(" ")}>
                {badgeText}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Actions */}
      <ScrollView contentContainerClassName="px-6 pt-8 gap-3">
        <Button
          label="Editar refeição"
          variant="primary"
          icon={<Pencil size={18} color="#FFFFFF" />}
          onPress={() => router.push(`/meals/${id}/edit`)}
        />
        <Button
          label="Excluir refeição"
          variant="secondary"
          icon={<Trash2 size={18} color="#1B1D1E" />}
          onPress={handleDelete}
          isLoading={isDeleting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
