import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { Input } from '@/components/Input';

interface PasswordFieldProps {
  label: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-1">
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholder={placeholder}
        accent="green"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword ? (
              <EyeOff size={18} color="#5C6265" />
            ) : (
              <Eye size={18} color="#5C6265" />
            )}
          </TouchableOpacity>
        }
      />
      {error && <Text className="text-xs text-redDark">{error}</Text>}
    </View>
  );
}
