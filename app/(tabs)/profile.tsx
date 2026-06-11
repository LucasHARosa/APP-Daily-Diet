import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray7 px-6">
      <View className="flex-1 justify-center gap-6">
        <View className="items-center gap-2">
          <View className="w-20 h-20 rounded-full bg-gray2 items-center justify-center border-2 border-gray1">
            <Text className="text-white text-2xl font-sans-bd">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </Text>
          </View>
          <Text className="text-xl font-sans-bd text-gray1">{user?.name ?? 'Usuário'}</Text>
          <Text className="text-sm text-gray3">{user?.email ?? ''}</Text>
        </View>

        <Button
          label="Sair"
          variant="secondary"
          icon={<LogOut size={18} color="#1B1D1E" />}
          onPress={logout}
        />
      </View>
    </SafeAreaView>
  );
}
