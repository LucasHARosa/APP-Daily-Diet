import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  rightElement?: React.ReactNode;
  accent?: 'default' | 'green';
}

export function Input({
  label,
  value,
  onChangeText,
  rightElement,
  accent = 'default',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasBorderActive = isFocused || (typeof value === 'string' && value.length > 0);
  const activeBorderClass = accent === 'green' ? 'border-greenDark' : 'border-gray1';

  return (
    <View className="gap-1">
      <Text className="text-sm font-sans-md text-gray2">{label}</Text>
      <View
        className={[
          'flex-row items-center rounded-lg border bg-white',
          hasBorderActive ? activeBorderClass : 'border-gray5',
        ].join(' ')}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#B9BBBC"
          className="flex-1 px-4 py-3 text-base text-gray1"
          {...props}
        />
        {rightElement != null && (
          <View className="pr-3">{rightElement}</View>
        )}
      </View>
    </View>
  );
}
