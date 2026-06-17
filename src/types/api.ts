export type Meal = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  eaten_at: string;
  is_on_diet: boolean;
  calories: number | null;
  created_at: string;
  updated_at: string;
};

export type MetricsSummary = {
  totalMeals: number;
  totalOnDiet: number;
  totalOffDiet: number;
  bestOnDietSequence: number;
  onDietPercentage: number;
};

export type MetricsPeriodGroup = {
  date: string;
  totalMeals: number;
  totalOnDiet: number;
  totalOffDiet: number;
  totalCalories: number;
};

export type MetricsPeriodSummary = {
  totalMeals: number;
  totalOnDiet: number;
  totalOffDiet: number;
  totalCalories: number;
  bestOnDietSequence: number;
};

export type MetricsPeriodResponse = {
  period: { start: string; end: string };
  summary: MetricsPeriodSummary;
  groups: MetricsPeriodGroup[];
};

export type FoodPlanMealItem = {
  id: string;
  name: string;
  description: string | null;
  scheduled_time: string | null;
  calories: number | null;
  sort_order: number;
};

export type FoodPlanDay = {
  id: string;
  weekday: number;
  weekday_name: string;
  meals: FoodPlanMealItem[];
};

export type FoodPlanActive = {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  days: FoodPlanDay[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

export type Profile = {
  weight_kg: number | null;
  height_cm: number | null;
  birth_date: string | null;
  body_fat_percentage: number | null;
  basal_calories: number | null;
  activity_level: string | null;
  gym_frequency_per_week: number | null;
};

export type UpdateProfileInput = Partial<Profile>;
