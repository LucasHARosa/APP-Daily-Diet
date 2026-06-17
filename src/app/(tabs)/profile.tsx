import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Minus, Plus } from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/stores/toast-store';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useProfile, useUpdateProfile } from '@/queries/profile';
import { ageToBirthDate, birthDateToAge } from '@/utils/date';

// ── Tipos ──────────────────────────────────────────────────────────────────────

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

const ACTIVITY_OPTIONS: { key: ActivityLevel; label: string; multiplier: number }[] = [
  { key: 'sedentary', label: 'Sedentário',       multiplier: 1.2   },
  { key: 'light',     label: 'Levemente ativo',  multiplier: 1.375 },
  { key: 'moderate',  label: 'Moderadamente',    multiplier: 1.55  },
  { key: 'active',    label: 'Muito ativo',      multiplier: 1.725 },
];

// ── Cálculos ───────────────────────────────────────────────────────────────────

function calcBMR(weight: number, height: number, age: number): number {
  // Mifflin-St Jeor (masculino como padrão)
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return (
    <Text className="text-sm font-sans-bd text-gray3 uppercase tracking-wider mb-2">
      {label}
    </Text>
  );
}

function Stepper({
  value,
  onDecrement,
  onIncrement,
  unit,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  unit: string;
}) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-lg border border-gray5 px-4 py-3">
      <TouchableOpacity
        onPress={onDecrement}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="w-8 h-8 rounded-full bg-gray6 items-center justify-center"
      >
        <Minus size={16} color="#5C6265" />
      </TouchableOpacity>
      <View className="items-center">
        <Text className="text-2xl font-sans-bd text-gray1">{value}</Text>
        <Text className="text-xs text-gray3 mt-0.5">{unit}</Text>
      </View>
      <TouchableOpacity
        onPress={onIncrement}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="w-8 h-8 rounded-full bg-gray1 items-center justify-center"
      >
        <Plus size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function MetricDisplay({ label, value, unit, highlight }: {
  label: string;
  value: number | string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <View
      className={[
        'flex-1 rounded-lg p-4 gap-0.5 items-center',
        highlight ? 'bg-greenLight' : 'bg-gray6',
      ].join(' ')}
    >
      <Text className={['text-2xl font-sans-bd', highlight ? 'text-greenDark' : 'text-gray1'].join(' ')}>
        {value}
      </Text>
      <Text className="text-xs text-gray3">{unit}</Text>
      <Text className="text-xs text-gray3 text-center">{label}</Text>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { toast } = useToast();

  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [weight, setWeight]     = useState('');
  const [height, setHeight]     = useState('');
  const [age, setAge]           = useState('');
  const [bodyFat, setBodyFat]   = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [gymDays, setGymDays]   = useState(0);

  useEffect(() => {
    if (!profile) return;
    setWeight(profile.weight_kg != null ? String(profile.weight_kg) : '');
    setHeight(profile.height_cm != null ? String(profile.height_cm) : '');
    setAge(profile.birth_date ? String(birthDateToAge(profile.birth_date)) : '');
    setBodyFat(profile.body_fat_percentage != null ? String(profile.body_fat_percentage) : '');
    setActivity((profile.activity_level as ActivityLevel) ?? 'moderate');
    setGymDays(profile.gym_frequency_per_week ?? 0);
  }, [profile]);

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'U';

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const a = parseFloat(age) || 0;
  const bmr = w > 0 && h > 0 && a > 0 ? calcBMR(w, h, a) : 0;
  const multiplier = ACTIVITY_OPTIONS.find((o) => o.key === activity)?.multiplier ?? 1.55;
  const tdee = bmr > 0 ? Math.round(bmr * multiplier) : 0;

  const handleSave = async () => {
    try {
      await updateProfile({
        weight_kg: w > 0 ? w : null,
        height_cm: h > 0 ? Math.round(h) : null,
        birth_date: a > 0 ? ageToBirthDate(a) : null,
        body_fat_percentage: parseFloat(bodyFat) || null,
        basal_calories: bmr > 0 ? bmr : null,
        activity_level: activity,
        gym_frequency_per_week: gymDays,
      });
      toast('Perfil atualizado com sucesso!', 'success');
    } catch {
      toast('Erro ao salvar. Tente novamente.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast('Até a próxima!', 'info');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-6 pt-4 pb-8 gap-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar + identidade */}
          <View className="items-center gap-2 pt-2">
            <View className="w-20 h-20 rounded-full bg-gray2 items-center justify-center border-2 border-gray1">
              <Text className="text-white text-2xl font-sans-bd">{initials}</Text>
            </View>
            <Text className="text-xl font-sans-bd text-gray1">{user?.name ?? 'Usuário'}</Text>
            <Text className="text-sm text-gray3">{user?.email ?? ''}</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#639339" />
          ) : (
            <>
              {/* Dados físicos */}
              <View className="gap-3">
                <SectionTitle label="Dados físicos" />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Input
                      label="Peso (kg)"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="decimal-pad"
                      placeholder="0"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="Altura (cm)"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="number-pad"
                      placeholder="0"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Input
                      label="Idade"
                      value={age}
                      onChangeText={setAge}
                      keyboardType="number-pad"
                      placeholder="0"
                    />
                  </View>
                  <View className="flex-1">
                    <Input
                      label="% Gordura corporal"
                      value={bodyFat}
                      onChangeText={setBodyFat}
                      keyboardType="decimal-pad"
                      placeholder="0"
                    />
                  </View>
                </View>
              </View>

              {/* Nível de atividade */}
              <View className="gap-3">
                <SectionTitle label="Nível de atividade" />
                <View className="flex-row flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map((opt) => {
                    const isSelected = activity === opt.key;
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        onPress={() => setActivity(opt.key)}
                        className={[
                          'px-4 py-2 rounded-full border',
                          isSelected
                            ? 'bg-gray1 border-gray1'
                            : 'bg-white border-gray4',
                        ].join(' ')}
                      >
                        <Text
                          className={[
                            'text-sm font-sans-md',
                            isSelected ? 'text-white' : 'text-gray3',
                          ].join(' ')}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Frequência na academia */}
              <View className="gap-3">
                <SectionTitle label="Frequência na academia" />
                <Stepper
                  value={gymDays}
                  unit="dias por semana"
                  onDecrement={() => setGymDays((d) => Math.max(0, d - 1))}
                  onIncrement={() => setGymDays((d) => Math.min(7, d + 1))}
                />
              </View>

              {/* Metabolismo calculado */}
              {bmr > 0 && (
                <View className="gap-3">
                  <SectionTitle label="Metabolismo estimado" />
                  <View className="flex-row gap-3">
                    <MetricDisplay
                      label="taxa metabólica basal"
                      value={bmr.toLocaleString('pt-BR')}
                      unit="kcal/dia"
                    />
                    <MetricDisplay
                      label="gasto energético total"
                      value={tdee.toLocaleString('pt-BR')}
                      unit="kcal/dia"
                      highlight
                    />
                  </View>
                  <Text className="text-xs text-gray3 text-center">
                    Calculado via Mifflin-St Jeor · valores estimados
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Ações */}
          <View className="gap-3 pt-2">
            <Button
              label="Salvar alterações"
              onPress={handleSave}
              isLoading={isSaving}
            />
            <Button
              label="Sair da conta"
              variant="secondary"
              icon={<LogOut size={18} color="#1B1D1E" />}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
