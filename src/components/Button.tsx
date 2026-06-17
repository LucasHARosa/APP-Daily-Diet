import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'brand';

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
  const isBrand = variant === 'brand';
  const hasWhiteText = isPrimary || isBrand;
  const isDisabled = disabled || isLoading;

  const containerClass = [
    'flex-row items-center justify-center gap-2 rounded-lg px-4 py-4',
    isBrand
      ? isDisabled
        ? 'bg-greenMid'
        : 'bg-greenDark'
      : isPrimary
      ? isDisabled
        ? 'bg-gray1 opacity-50'
        : 'bg-gray1'
      : isDisabled
      ? 'bg-gray5 border border-gray5'
      : 'bg-white border border-gray1',
  ].join(' ');

  const textClass = [
    'text-base font-sans-sb',
    hasWhiteText
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
        <ActivityIndicator color={hasWhiteText ? '#FFFFFF' : '#1B1D1E'} />
      ) : (
        <>
          {icon != null && <View>{icon}</View>}
          <Text className={textClass}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
