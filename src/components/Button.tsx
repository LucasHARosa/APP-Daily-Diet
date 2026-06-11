import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  label: string;
  variant?: Variant;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  icon,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || isLoading;

  const containerClass = [
    'flex-row items-center justify-center gap-2 rounded-lg px-4 py-4',
    isPrimary
      ? isDisabled
        ? 'bg-gray1 opacity-50'
        : 'bg-gray1'
      : isDisabled
      ? 'bg-gray5 border border-gray5'
      : 'bg-white border border-gray1',
  ].join(' ');

  const textClass = [
    'text-base font-semibold',
    isPrimary
      ? 'text-white'
      : isDisabled
      ? 'text-gray4'
      : 'text-gray1',
  ].join(' ');

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      className={containerClass}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#1B1D1E'} />
      ) : (
        <>
          {icon != null && <View>{icon}</View>}
          <Text className={textClass}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
