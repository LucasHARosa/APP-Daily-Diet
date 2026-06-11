import { Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4">
        <Image
          source={require('@/assets/images/Logo.png')}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-gray1 text-2xl font-bold">Daily Diet</Text>
      </View>
    </SafeAreaView>
  );
}
