import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react-native';
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
import { Input } from '@/components/Input';
import { useToast } from '@/stores/toast-store';
import {
  useFoodPlan,
  useUpdateFoodPlan,
  useSetFoodPlanActive,
  useDeleteFoodPlan,
  useAddMealToDay,
  useUpdateMealItem,
  useDeleteMealItem,
} from '@/queries/foodPlans';
import type { FoodPlanMealItem } from '@/types/api';

const DAY_SHORT_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// ── Form de refeição (criar/editar) ─────────────────────────────────────────────

function MealItemForm({
  initial,
  onSubmit,
  onCancel,
  isSaving,
}: {
  initial?: FoodPlanMealItem;
  onSubmit: (data: { name: string; scheduledTime: string; calories: string }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [scheduledTime, setScheduledTime] = useState(initial?.scheduled_time ?? '');
  const [calories, setCalories] = useState(initial?.calories != null ? String(initial.calories) : '');

  return (
    <View className="gap-3 bg-gray6 rounded-lg p-3">
      <Input label="Nome" value={name} onChangeText={setName} placeholder="Ex: Almoço" />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Horário"
            value={scheduledTime}
            onChangeText={setScheduledTime}
            placeholder="HH:MM"
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Calorias"
            value={calories}
            onChangeText={setCalories}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button label="Cancelar" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button
            label="Salvar"
            isLoading={isSaving}
            onPress={() => {
              if (!name.trim()) return;
              onSubmit({ name: name.trim(), scheduledTime, calories });
            }}
          />
        </View>
      </View>
    </View>
  );
}

// ── Item de refeição planejada ───────────────────────────────────────────────────

function MealItemRow({
  meal,
  planId,
  weekday,
  sortOrder,
}: {
  meal: FoodPlanMealItem;
  planId: string;
  weekday: number;
  sortOrder: number;
}) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateMealItem();
  const { mutateAsync: deleteItem } = useDeleteMealItem();

  const handleSave = async (data: { name: string; scheduledTime: string; calories: string }) => {
    try {
      await updateItem({
        mealId: meal.id,
        name: data.name,
        scheduled_time: data.scheduledTime || undefined,
        calories: data.calories ? Number(data.calories) : undefined,
        sort_order: sortOrder,
      });
      setIsEditing(false);
      toast('Refeição atualizada.', 'success');
    } catch {
      toast('Erro ao salvar refeição.', 'error');
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir refeição', `Remover "${meal.name}" do plano?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(meal.id);
            toast('Refeição removida.', 'info');
          } catch {
            toast('Erro ao remover refeição.', 'error');
          }
        },
      },
    ]);
  };

  if (isEditing) {
    return (
      <MealItemForm
        initial={meal}
        isSaving={isUpdating}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleSave}
      />
    );
  }

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray6">
      <Text className="text-sm text-gray3 w-12">{meal.scheduled_time ?? '--:--'}</Text>
      <View className="w-px h-4 bg-gray4" />
      <Text className="flex-1 text-base text-gray1" numberOfLines={1}>
        {meal.name}
      </Text>
      {meal.calories != null && (
        <Text className="text-xs font-sans-md text-gray2">{meal.calories} kcal</Text>
      )}
      <TouchableOpacity onPress={() => setIsEditing(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Pencil size={16} color="#5C6265" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Trash2 size={16} color="#BF3B44" />
      </TouchableOpacity>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function FoodPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const { data: plan, isLoading } = useFoodPlan(id);
  const { mutateAsync: updatePlan, isPending: isSavingInfo } = useUpdateFoodPlan();
  const { mutateAsync: setActive, isPending: isToggling } = useSetFoodPlanActive();
  const { mutateAsync: deletePlan } = useDeleteFoodPlan();
  const { mutateAsync: addMeal, isPending: isAdding } = useAddMealToDay();

  const [activeDay, setActiveDay] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
      setDescription(plan.description ?? '');
    }
  }, [plan]);

  const day = plan?.days.find((d) => d.weekday === activeDay);

  const handleSaveInfo = async () => {
    if (!title.trim()) return;
    try {
      await updatePlan({ id, title: title.trim(), description: description || undefined });
      toast('Plano atualizado.', 'success');
    } catch {
      toast('Erro ao salvar plano.', 'error');
    }
  };

  const handleToggleActive = async (value: boolean) => {
    try {
      await setActive({ id, isActive: value });
    } catch {
      toast('Erro ao atualizar status do plano.', 'error');
    }
  };

  const handleDeletePlan = () => {
    Alert.alert('Excluir plano', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePlan(id);
            router.replace('/food-plans');
          } catch {
            toast('Erro ao excluir plano.', 'error');
          }
        },
      },
    ]);
  };

  const handleAddMeal = async (data: { name: string; scheduledTime: string; calories: string }) => {
    try {
      await addMeal({
        planId: id,
        weekday: activeDay,
        name: data.name,
        scheduled_time: data.scheduledTime || undefined,
        calories: data.calories ? Number(data.calories) : undefined,
        sort_order: (day?.meals.length ?? 0) + 1,
      });
      setIsAddingMeal(false);
      toast('Refeição adicionada.', 'success');
    } catch {
      toast('Erro ao adicionar refeição.', 'error');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray7 items-center justify-center">
        <ActivityIndicator color="#639339" />
      </SafeAreaView>
    );
  }

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
        <Text className="flex-1 text-center text-lg font-sans-bd text-gray1">
          Gerenciar plano
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerClassName="px-6 pb-8 gap-5">
        {/* Informações do plano */}
        <View className="bg-white rounded-xl border border-gray5 p-4 gap-3">
          <Input label="Título" value={title} onChangeText={setTitle} />
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ minHeight: 70 }}
          />
          <Button label="Salvar informações" onPress={handleSaveInfo} isLoading={isSavingInfo} />

          <View className="flex-row items-center justify-between pt-2 border-t border-gray6">
            <View className="flex-row items-center gap-2">
              <Switch
                value={plan?.is_active ?? false}
                onValueChange={handleToggleActive}
                disabled={isToggling}
                trackColor={{ false: '#EFF0F0', true: '#A9CD8B' }}
                thumbColor={plan?.is_active ? '#639339' : '#B9BBBC'}
              />
              <Text className="text-sm text-gray3">
                {plan?.is_active ? 'Plano ativo' : 'Inativo'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleDeletePlan}
              className="flex-row items-center gap-1"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={16} color="#BF3B44" />
              <Text className="text-sm text-redDark">Excluir plano</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seletor de dia */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {DAY_SHORT_NAMES.map((name, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setActiveDay(index);
                setIsAddingMeal(false);
              }}
              className={[
                'items-center px-4 py-2 rounded-xl',
                index === activeDay ? 'bg-greenDark' : 'bg-white border border-gray5',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-xs font-sans-bd',
                  index === activeDay ? 'text-white' : 'text-gray1',
                ].join(' ')}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Refeições do dia */}
        <View className="bg-white rounded-xl border border-gray5 px-4">
          <Text className="text-sm font-sans-bd text-gray3 pt-4 pb-2">
            {day?.weekday_name ?? DAY_SHORT_NAMES[activeDay]} · {day?.meals.length ?? 0} refeições
          </Text>

          {day?.meals.map((meal) => (
            <MealItemRow
              key={meal.id}
              meal={meal}
              planId={id}
              weekday={activeDay}
              sortOrder={meal.sort_order}
            />
          ))}

          <View className="py-4">
            {isAddingMeal ? (
              <MealItemForm
                isSaving={isAdding}
                onCancel={() => setIsAddingMeal(false)}
                onSubmit={handleAddMeal}
              />
            ) : (
              <Button
                label="Adicionar refeição"
                variant="secondary"
                icon={<Plus size={18} color="#1B1D1E" />}
                onPress={() => setIsAddingMeal(true)}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
