import { Text, TouchableOpacity, View } from 'react-native';

interface AuthFooterLinkProps {
  question: string;
  actionLabel: string;
  onPress: () => void;
}

export function AuthFooterLink({ question, actionLabel, onPress }: AuthFooterLinkProps) {
  return (
    <View className="items-center mt-10 gap-1">
      <Text className="text-sm text-gray3">{question}</Text>
      <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text className="text-sm font-sans-bd text-greenDark underline">{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
