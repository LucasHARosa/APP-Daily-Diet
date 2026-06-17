import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

interface AuthHeaderProps {
  eyebrow: string;
  subtitle: string;
  onBack?: () => void;
}

export function AuthHeader({ eyebrow, subtitle, onBack }: AuthHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        className="-mx-6 bg-greenLight rounded-b-[32px] pb-10 items-center overflow-hidden"
        style={{ paddingTop: insets.top + 24 }}
      >
        <View className="absolute w-32 h-32 rounded-full bg-greenMid -top-10 -right-10" />

        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="absolute left-6 w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{ top: insets.top + 24 }}
          >
            <ArrowLeft size={20} color="#1B1D1E" />
          </TouchableOpacity>
        )}

        <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-sm">
          <Image
            source={require('@/assets/images/Logo.png')}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

        <View className="w-10 h-1.5 rounded-full bg-redMid mt-4" />
      </View>

      <Text className="text-xs font-sans-sb text-greenDark text-center uppercase tracking-wide mt-6">
        {eyebrow}
      </Text>
      <Text className="text-xl font-sans-bd text-gray1 text-center mt-1">{subtitle}</Text>
    </>
  );
}
