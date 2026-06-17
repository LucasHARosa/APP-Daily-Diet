import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface AuthHeaderProps {
  subtitle: string;
  onBack?: () => void;
}

export function AuthHeader({ subtitle, onBack }: AuthHeaderProps) {
  return (
    <View className="items-center pt-2">
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="absolute left-0 top-2 w-10 h-10 rounded-full bg-white items-center justify-center border border-gray5"
        >
          <ArrowLeft size={20} color="#1B1D1E" />
        </TouchableOpacity>
      )}

      <View className="items-center justify-center">
        <View className="absolute w-28 h-28 rounded-full bg-redLight -top-3 -right-8 opacity-70" />
        <View className="absolute w-16 h-16 rounded-full bg-greenMid -bottom-4 -left-10 opacity-60" />

        <View className="w-24 h-24 rounded-full bg-greenLight items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-white items-center justify-center">
            <Image
              source={require('@/assets/images/Logo.png')}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <Text className="text-xl font-sans-bd text-gray1 mt-6">{subtitle}</Text>
    </View>
  );
}
