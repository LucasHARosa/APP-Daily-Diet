import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MealsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray7 items-center justify-center">
      <Text className="text-gray3 text-base">Refeições — em breve</Text>
    </SafeAreaView>
  );
}
