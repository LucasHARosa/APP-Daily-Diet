import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useToast } from '@/stores/toast-store';
import {
  useFoodPlans,
  useSetFoodPlanActive,
  useDeleteFoodPlan,
} from '@/queries/foodPlans';
import type { FoodPlanSummary } from '@/types/api';

function PlanRow({ plan }: { plan: FoodPlanSummary }) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync: setActive, isPending: isToggling } = useSetFoodPlanActive();
  const { mutateAsync: deletePlan } = useDeleteFoodPlan();

  const handleToggle = async (value: boolean) => {
    try {
      await setActive({ id: plan.id, isActive: value });
      toast(value ? 'Plano ativado.' : 'Plano desativado.', 'success');
    } catch {
      toast('Erro ao atualizar o plano.', 'error');
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir plano', `Deseja excluir "${plan.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePlan(plan.id);
            toast('Plano excluído.', 'info');
          } catch {
            toast('Erro ao excluir plano.', 'error');
          }
        },
      },
    ]);
  };

  return (
    <View className="bg-white rounded-xl border border-gray5 p-4 gap-3">
      <TouchableOpacity onPress={() => router.push(`/food-plans/${plan.id}`)} activeOpacity={0.7}>
        <Text className="text-base font-sans-bd text-gray1">{plan.title}</Text>
        {plan.description ? (
          <Text className="text-sm text-gray3 mt-1" numberOfLines={2}>
            {plan.description}
          </Text>
        ) : null}
      </TouchableOpacity>

      <View className="flex-row items-center justify-between pt-2 border-t border-gray6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={plan.is_active}
            onValueChange={handleToggle}
            disabled={isToggling}
            trackColor={{ false: '#EFF0F0', true: '#A9CD8B' }}
            thumbColor={plan.is_active ? '#639339' : '#B9BBBC'}
          />
          <Text className="text-sm text-gray3">
            {plan.is_active ? 'Plano ativo' : 'Inativo'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={18} color="#BF3B44" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FoodPlansListScreen() {
  const router = useRouter();
  const { data: plans, isLoading } = useFoodPlans();

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-4 pt-2 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={24} color="#1B1D1E" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-sans-bd text-gray1 -ml-8">
          Meus planos
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-6 pt-2 pb-8 gap-3">
        <Button
          label="Novo plano"
          icon={<Plus size={18} color="#FFFFFF" />}
          onPress={() => router.push('/food-plans/new')}
        />

        {isLoading ? (
          <ActivityIndicator color="#639339" className="mt-6" />
        ) : plans && plans.length > 0 ? (
          plans.map((plan) => <PlanRow key={plan.id} plan={plan} />)
        ) : (
          <Text className="text-sm text-gray3 text-center mt-6">
            Você ainda não criou nenhum plano alimentar.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
