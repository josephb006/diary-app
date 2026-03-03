export interface CustomField {
  label: string;
  value: string;
}

export interface ExerciseInput {
  id?: string;
  type: string;
  duration?: number | null;
  note?: string | null;
}

export interface MealInput {
  id?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  content: string;
}

export interface DiaryFormData {
  happenings: string;
  gratitude: string;
  sleepBedTime: string;
  sleepWakeTime: string;
  bodyStatus: number;
  bodyNote: string;
  soulStatus: number;
  soulNote: string;
  games: string;
  shopping: string;
  exercises: ExerciseInput[];
  meals: MealInput[];
  customFields: CustomField[];
}

export interface DiaryEntryFull {
  id: string;
  date: string;
  happenings: string | null;
  gratitude: string | null;
  sleepBedTime: string | null;
  sleepWakeTime: string | null;
  bodyStatus: number | null;
  bodyNote: string | null;
  soulStatus: number | null;
  soulNote: string | null;
  games: string | null;
  shopping: string | null;
  customFields: string | null;
  searchContent: string | null;
  quoteId: string | null;
  quote: QuoteData | null;
  exercises: ExerciseData[];
  meals: MealData[];
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseData {
  id: string;
  type: string;
  duration: number | null;
  note: string | null;
}

export interface MealData {
  id: string;
  mealType: string;
  content: string;
}

export interface QuoteData {
  id: string;
  text: string;
  author: string | null;
  source: string | null;
  isFavorite: boolean;
}

export const EMPTY_DIARY_FORM: DiaryFormData = {
  happenings: '',
  gratitude: '',
  sleepBedTime: '',
  sleepWakeTime: '',
  bodyStatus: 3,
  bodyNote: '',
  soulStatus: 3,
  soulNote: '',
  games: '',
  shopping: '',
  exercises: [],
  meals: [],
  customFields: [],
};

export const MEAL_TYPES = [
  { value: 'breakfast', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
  { value: 'snack', label: '간식' },
] as const;

export const BODY_SOUL_LABELS = [
  '매우 나쁨',
  '나쁨',
  '보통',
  '좋음',
  '매우 좋음',
] as const;
