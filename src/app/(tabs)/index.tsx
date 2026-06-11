import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  type SectionListData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowUpRight, Plus } from 'lucide-react-native';

import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/Button';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_PERCENTAGE = 90.86;

interface Meal {
  id: string;
  time: string;
  name: string;
  isOnDiet: boolean;
}

interface MealSection {
  date: string;
  data: Meal[];
}

const MOCK_MEALS: MealSection[] = [
  {
    date: '12.08.22',
    data: [
      { id: '1', time: '20:00', name: 'X-tudo', isOnDiet: false },
      { id: '2', time: '16:00', name: 'Whey protein com leite', isOnDiet: true },
      { id: '3', time: '12:30', name: 'Salada cesar com frango...', isOnDiet: true },
      { id: '4', time: '09:30', name: 'Vitamina de banana com...', isOnDiet: true },
    ],
  },
  {
    date: '11.08.22',
    data: [
      { id: '5', time: '20:00', name: 'X-tudo', isOnDiet: false },
      { id: '6', time: '16:00', name: 'Whey protein com leite', isOnDiet: true },
      { id: '7', time: '12:30', name: 'Salada cesar com frango...', isOnDiet: true },
      { id: '8', time: '09:30', name: 'Vitamina de banana com...', isOnDiet: true },
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function Header() {
  const { user } = useAuthStore();
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-row items-center gap-2">
        <Image
          source={require('@/assets/images/Logo.png')}
          className="w-8 h-8"
          resizeMode="contain"
        />
        <View>
          <Text className="text-lg font-bold text-gray1 leading-tight">Daily</Text>
          <Text className="text-lg font-bold text-gray1 leading-tight">Diet</Text>
        </View>
      </View>
      <View className="w-11 h-11 rounded-full bg-gray2 items-center justify-center border-2 border-gray1">
        <Text className="text-white text-sm font-bold">{initials}</Text>
      </View>
    </View>
  );
}

function PercentageCard({ percentage }: { percentage: number }) {
  const router = useRouter();
  const isGood = percentage >= 70;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/stats' as never)}
      className={[
        'mx-6 rounded-lg px-4 py-6 items-center',
        isGood ? 'bg-greenLight' : 'bg-redLight',
      ].join(' ')}
    >
      <ArrowUpRight
        size={20}
        color={isGood ? '#639339' : '#BF3B44'}
        style={{ position: 'absolute', top: 12, right: 12 }}
      />
      <Text
        className={[
          'text-4xl font-bold',
          isGood ? 'text-greenDark' : 'text-redDark',
        ].join(' ')}
      >
        {percentage.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        %
      </Text>
      <Text className="text-sm text-gray2 mt-1">
        das refeições dentro da dieta
      </Text>
    </TouchableOpacity>
  );
}

function MealRow({ meal }: { meal: Meal }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/meals/${meal.id}` as never)}
      className="flex-row items-center bg-white rounded-lg border border-gray5 px-3 py-3 gap-3"
    >
      <Text className="text-sm text-gray3 w-12">{meal.time}</Text>
      <View className="w-px h-4 bg-gray4" />
      <Text className="flex-1 text-base text-gray1" numberOfLines={1}>
        {meal.name}
      </Text>
      <View
        className={[
          'w-3 h-3 rounded-full',
          meal.isOnDiet ? 'bg-greenMid' : 'bg-redMid',
        ].join(' ')}
      />
    </TouchableOpacity>
  );
}

function SectionHeader({ date }: { date: string }) {
  return (
    <Text className="text-base font-bold text-gray1 mb-2 mt-4">{date}</Text>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray7" edges={['top']}>
      <SectionList<Meal, MealSection>
        sections={MOCK_MEALS}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerClassName="pb-6"
        ListHeaderComponent={
          <>
            <Header />
            <View className="px-6 mb-6">
              <PercentageCard percentage={MOCK_PERCENTAGE} />
            </View>
            <View className="px-6 mb-2">
              <Text className="text-base font-bold text-gray1 mb-3">
                Refeições
              </Text>
              <Button
                label="Nova refeição"
                icon={<Plus size={18} color="#FFFFFF" />}
                onPress={() => router.push('/meals/new' as never)}
              />
            </View>
          </>
        }
        renderSectionHeader={({ section }) => (
          <View className="px-6">
            <SectionHeader date={section.date} />
          </View>
        )}
        renderItem={({ item }) => (
          <View className="px-6 mb-2">
            <MealRow meal={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
