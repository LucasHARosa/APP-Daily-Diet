import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";

// ── Mock data ──────────────────────────────────────────────────────────────────

interface Meal {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  isOnDiet: boolean;
}

const MOCK_MEALS: Record<string, Meal> = {
  "1": {
    id: "1",
    name: "X-tudo",
    description: "Xis completo da lancheria do bairro",
    date: "12/08/2022",
    time: "20:00",
    isOnDiet: false,
  },
  "2": {
    id: "2",
    name: "Whey protein com leite",
    description: "Whey protein com leite integral",
    date: "12/08/2022",
    time: "16:00",
    isOnDiet: true,
  },
  "3": {
    id: "3",
    name: "Salada cesar com frango",
    description: "Salada cesar com frango grelhado, croutons e molho",
    date: "12/08/2022",
    time: "12:30",
    isOnDiet: true,
  },
  "4": {
    id: "4",
    name: "Vitamina de banana com aveia",
    description: "Vitamina de banana com aveia e mel",
    date: "12/08/2022",
    time: "09:30",
    isOnDiet: true,
  },
};

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function MealDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const meal = MOCK_MEALS[id] ?? {
    id,
    name: "Refeição",
    description: "",
    date: "--/--/----",
    time: "--:--",
    isOnDiet: true,
  };

  const isOnDiet = meal.isOnDiet;
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
          onPress: () => router.replace("/(tabs)"),
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

        <Text className="text-2xl font-sans-bd text-gray1 mb-1">
          {meal.name}
        </Text>
        {meal.description ? (
          <Text className="text-base text-gray2 mb-6">{meal.description}</Text>
        ) : null}

        <Text className="text-sm font-sans-bd text-gray1 mb-1">
          Data e hora
        </Text>
        <Text className="text-base text-gray2 mb-6">
          {meal.date} às {meal.time}
        </Text>

        <View className="flex-row items-center gap-2 self-start bg-gray6 px-3 py-1 rounded-full">
          <View className={["w-2 h-2 rounded-full", badgeColor].join(" ")} />
          <Text className={["text-sm font-sans-md", badgeTextColor].join(" ")}>
            {badgeText}
          </Text>
        </View>
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
        />
      </ScrollView>
    </SafeAreaView>
  );
}
