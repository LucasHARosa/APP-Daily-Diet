import { View, Text, TouchableOpacity } from 'react-native';

interface DietToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function DietToggle({ value, onChange }: DietToggleProps) {
  return (
    <View className="flex-row gap-3">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChange(true)}
        className={[
          'flex-1 flex-row items-center justify-center gap-2 rounded-lg py-4',
          value === true
            ? 'bg-greenLight border border-greenMid'
            : 'bg-gray6',
        ].join(' ')}
      >
        <View
          className={[
            'w-2 h-2 rounded-full',
            value === true ? 'bg-greenDark' : 'bg-gray4',
          ].join(' ')}
        />
        <Text
          className={[
            'text-sm font-semibold',
            value === true ? 'text-greenDark' : 'text-gray2',
          ].join(' ')}
        >
          Sim
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChange(false)}
        className={[
          'flex-1 flex-row items-center justify-center gap-2 rounded-lg py-4',
          value === false
            ? 'bg-redLight border border-redMid'
            : 'bg-gray6',
        ].join(' ')}
      >
        <View
          className={[
            'w-2 h-2 rounded-full',
            value === false ? 'bg-redDark' : 'bg-gray4',
          ].join(' ')}
        />
        <Text
          className={[
            'text-sm font-semibold',
            value === false ? 'text-redDark' : 'text-gray2',
          ].join(' ')}
        >
          Não
        </Text>
      </TouchableOpacity>
    </View>
  );
}
