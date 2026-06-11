import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ label, value, onChangeText, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasBorderActive = isFocused || (typeof value === 'string' && value.length > 0);

  return (
    <View className="gap-1">
      <Text className="text-sm font-sans-md text-gray2">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#B9BBBC"
        className={[
          'rounded-lg border px-4 py-3 text-base text-gray1 bg-white',
          hasBorderActive ? 'border-gray1' : 'border-gray5',
        ].join(' ')}
        {...props}
      />
    </View>
  );
}
