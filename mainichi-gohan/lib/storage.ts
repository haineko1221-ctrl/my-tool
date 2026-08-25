import { format, parseISO, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { MealRecord, StreakData, STORAGE_KEYS } from '@/types/meal';
import { generateId } from './utils';

const KEYS = {
  MEALS: 'mainichi-gohan:meals',
  STREAK: 'mainichi-gohan:streak',
} as const;

/**
 * 食事記録を保存
 */
export function saveMealRecord(
  imageDataUrl: string,
  analysis: MealRecord['analysis']
): MealRecord {
  const record: MealRecord = {
    id: generateId(),
    timestamp: Date.now(),
    photoDataUrl: imageDataUrl,
    analysis,
  };

  // 既存の記録を取得
  const meals = getMealRecords();

  // 新しい記録を先頭に追加
  meals.unshift(record);

  // 最新10件のみ保存（容量節約）
  const mealsToSave = meals.slice(0, 10);

  // LocalStorageに保存
  localStorage.setItem(KEYS.MEALS, JSON.stringify(mealsToSave));

  // 連続記録を更新
  updateStreak();

  return record;
}

/**
 * 食事記録を取得
 */
export function getMealRecords(limit: number = 10): MealRecord[] {
  try {
    const stored = localStorage.getItem(KEYS.MEALS);
    if (!stored) return [];

    const meals: MealRecord[] = JSON.parse(stored);
    return meals.slice(0, limit);
  } catch (error) {
    console.error('食事記録の読み込みエラー:', error);
    return [];
  }
}

/**
 * 連続記録を更新
 */
export function updateStreak(): StreakData {
  const today = format(new Date(), 'yyyy-MM-dd');
  const streak = getStreak();

  // 今日既にチェック済みの場合は何もしない
  if (streak.lastCheckDate === today) {
    return streak;
  }

  const lastDate = streak.lastCheckDate
    ? parseISO(streak.lastCheckDate)
    : null;

  let newStreak: StreakData;

  if (!lastDate) {
    // 初めての記録
    newStreak = {
      currentStreak: 1,
      lastCheckDate: today,
      totalChecks: 1,
    };
  } else {
    const daysDiff = differenceInDays(new Date(), lastDate);

    if (daysDiff === 1) {
      // 連続記録継続
      newStreak = {
        currentStreak: streak.currentStreak + 1,
        lastCheckDate: today,
        totalChecks: streak.totalChecks + 1,
      };
    } else if (daysDiff > 1) {
      // 連続記録途切れた
      newStreak = {
        currentStreak: 1,
        lastCheckDate: today,
        totalChecks: streak.totalChecks + 1,
      };
    } else {
      // 同じ日（起こらないはず）
      return streak;
    }
  }

  // LocalStorageに保存
  localStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));

  return newStreak;
}

/**
 * 連続記録を取得
 */
export function getStreak(): StreakData {
  try {
    const stored = localStorage.getItem(KEYS.STREAK);
    if (!stored) {
      return {
        currentStreak: 0,
        lastCheckDate: '',
        totalChecks: 0,
      };
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('連続記録の読み込みエラー:', error);
    return {
      currentStreak: 0,
      lastCheckDate: '',
      totalChecks: 0,
    };
  }
}

/**
 * 今週のチェック回数を取得
 */
export function getWeeklyCheckCount(): number {
  const meals = getMealRecords(100); // 多めに取得
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // 日曜日
  weekStart.setHours(0, 0, 0, 0);

  return meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    return mealDate >= weekStart;
  }).length;
}

/**
 * 日付をフォーマット
 */
export function formatMealDate(timestamp: number): string {
  return format(new Date(timestamp), 'M月d日（E） HH:mm', { locale: ja });
}

/**
 * 相対的な日付表示（今日、昨日など）
 */
export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = differenceInDays(today, targetDate);

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays === 2) return '一昨日';

  return format(date, 'M月d日（E）', { locale: ja });
}
