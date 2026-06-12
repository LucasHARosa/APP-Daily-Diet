import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react-native';

import { useToastStore } from '@/stores/toast-store';

const VARIANTS = {
  success: { bg: '#639339', Icon: CheckCircle2 },
  error:   { bg: '#BF3B44', Icon: XCircle },
  info:    { bg: '#1B1D1E', Icon: Info },
};

export function Toast() {
  const { message, type, visible, hide } = useToastStore();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-160)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();

    timerRef.current = setTimeout(dismiss, 3500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, message]);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -160,
      duration: 280,
      useNativeDriver: true,
    }).start(() => hide());
  };

  const { bg, Icon } = VARIANTS[type];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={dismiss}
        style={{
          backgroundColor: bg,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Icon size={20} color="#fff" />
        <Text
          style={{
            flex: 1,
            color: '#fff',
            fontSize: 14,
            fontFamily: 'NunitoSans_500Medium',
            lineHeight: 20,
          }}
        >
          {message}
        </Text>
        <X size={16} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    </Animated.View>
  );
}
