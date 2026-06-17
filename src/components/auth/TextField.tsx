import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { Input } from '@/components/Input';

type TextFieldProps = ComponentProps<typeof Input> & {
  error?: string;
};

export function TextField({ error, ...props }: TextFieldProps) {
  return (
    <View className="gap-1">
      <Input {...props} />
      {error && <Text className="text-xs text-redDark">{error}</Text>}
    </View>
  );
}
