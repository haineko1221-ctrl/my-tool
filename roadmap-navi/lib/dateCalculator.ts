import { RoadmapStep, CustomerProgress, Customer } from '@/types';

/**
 * 指定日にN日を加算する
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 2つの日付が同じ日かどうかを判定
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * date1がdate2より前の日かどうかを判定
 */
export function isBefore(date1: Date, date2: Date): boolean {
  // 時刻を無視して日付だけで比較
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1 < d2;
}

/**
 * 今日の日付を取得（時刻を00:00:00にリセット）
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * ステップの予定日を計算する
 *
 * ルート再計算ロジック：
 * - baseType === 'registration': 登録日を基準に計算
 * - baseType === 'previous_completion': 前ステップの完了日を基準に計算
 * - baseType === 'annual_fixed_date': 毎年固定日付（年中行事）
 */
export function calculateScheduledDate(
  step: RoadmapStep,
  customer: Customer,
  previousProgress?: CustomerProgress
): Date | null {
  if (step.baseType === 'registration') {
    // 登録日基準
    return addDays(customer.registeredAt, step.dayOffset);
  } else if (step.baseType === 'previous_completion') {
    // 前ステップの完了日基準
    if (!previousProgress || !previousProgress.completedAt) {
      // 前ステップが未完了の場合、予定日は計算できない
      return null;
    }
    return addDays(previousProgress.completedAt, step.dayOffset);
  } else if (step.baseType === 'annual_fixed_date') {
    // 年中行事（毎年固定日付）
    if (step.fixedMonth === undefined || step.fixedDay === undefined) {
      return null;
    }
    return getNextAnnualDate(step.fixedMonth, step.fixedDay);
  }

  return null;
}

/**
 * 次の年中行事の日付を取得
 * 今年のその日付がまだ来ていなければ今年、過ぎていれば来年
 */
export function getNextAnnualDate(month: number, day: number): Date {
  const today = getToday();
  const currentYear = today.getFullYear();

  // 今年の日付を作成（月は0始まりなので-1）
  const thisYear = new Date(currentYear, month - 1, day);
  thisYear.setHours(0, 0, 0, 0);

  // 今日以降ならその日、過ぎていれば来年
  if (thisYear >= today) {
    return thisYear;
  } else {
    return new Date(currentYear + 1, month - 1, day);
  }
}

/**
 * 進捗のステータスを判定する
 */
export function determineProgressStatus(
  scheduledDate: Date | null,
  completedAt: Date | null
): 'pending' | 'completed' | 'overdue' {
  if (completedAt) {
    return 'completed';
  }

  if (!scheduledDate) {
    return 'pending';
  }

  const today = getToday();
  if (isBefore(scheduledDate, today)) {
    return 'overdue';
  }

  return 'pending';
}

/**
 * 遅延日数を計算する
 */
export function calculateDaysOverdue(scheduledDate: Date): number {
  const today = getToday();
  const diffTime = today.getTime() - scheduledDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * 日付を "YYYY/MM/DD" 形式にフォーマット
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}
