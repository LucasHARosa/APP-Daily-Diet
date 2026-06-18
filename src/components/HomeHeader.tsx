import { Image, Text, View } from "react-native";

import { useAuthStore } from "@/stores/auth-store";

export function HomeHeader() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] ?? "Visitante";
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-3">
        <Image
          source={require("@/assets/images/Logo.png")}
          className="w-auto h-8"
          resizeMode="contain"
        />
        <View>
          <Text className="text-xs text-gray3 leading-tight">Olá,</Text>
          <Text className="text-lg font-sans-bd text-gray1 leading-tight">
            {firstName}
          </Text>
        </View>
      </View>
      <View className="w-11 h-11 rounded-full bg-greenLight items-center justify-center border-2 border-greenMid">
        <Text className="text-greenDark text-sm font-sans-bd">{initials}</Text>
      </View>
    </View>
  );
}
