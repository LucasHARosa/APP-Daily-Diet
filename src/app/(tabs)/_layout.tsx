import { Tabs } from 'expo-router';
import { Home, UtensilsCrossed, Calendar, User } from 'lucide-react-native';

function tabColor(focused: boolean) {
  return focused ? '#639339' : '#B9BBBC';
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EFF0F0',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#639339',
        tabBarInactiveTintColor: '#B9BBBC',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Home size={22} color={tabColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Refeições',
          tabBarIcon: ({ focused }) => <UtensilsCrossed size={22} color={tabColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plano',
          tabBarIcon: ({ focused }) => <Calendar size={22} color={tabColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <User size={22} color={tabColor(focused)} />,
        }}
      />
    </Tabs>
  );
}
