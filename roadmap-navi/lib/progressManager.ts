import { Customer, Roadmap, RoadmapStep, CustomerProgress } from '@/types';
import {
  calculateScheduledDate,
  determineProgressStatus,
  getToday,
} from './dateCalculator';
import { v4 as uuidv4 } from 'uuid';

/**
 * 顧客登録時に、全ステップの進捗を生成する
 */
export function generateInitialProgress(
  customer: Customer,
  roadmap: Roadmap
): CustomerProgress[] {
  const progressList: CustomerProgress[] = [];

  roadmap.steps.forEach((step, index) => {
    const previousProgress = index > 0 ? progressList[index - 1] : undefined;
    const scheduledDate = calculateScheduledDate(
      step,
      customer,
      previousProgress
    );

    const progress: CustomerProgress = {
      id: uuidv4(),
      customerId: customer.id,
      stepId: step.id,
      scheduledDate,
      completedAt: null,
      status: determineProgressStatus(scheduledDate, null),
    };

    progressList.push(progress);
  });

  return progressList;
}

/**
 * ステップを完了する
 * ★完了後、次以降のステップの予定日を再計算する★
 * ★繰り返しステップの場合は、次の同じステップを自動追加する★
 */
export function completeStep(
  progressId: string,
  allProgress: CustomerProgress[],
  customer: Customer,
  roadmap: Roadmap
): CustomerProgress[] {
  const updatedProgress = [...allProgress];
  const targetIndex = updatedProgress.findIndex((p) => p.id === progressId);

  if (targetIndex === -1) {
    throw new Error('Progress not found');
  }

  const completedProgress = updatedProgress[targetIndex];
  const completedStep = roadmap.steps.find(
    (s) => s.id === completedProgress.stepId
  );

  // 完了日時を設定
  updatedProgress[targetIndex] = {
    ...updatedProgress[targetIndex],
    completedAt: new Date(),
    status: 'completed',
  };

  // ★繰り返しステップの処理★
  if (completedStep?.isRepeating && completedStep.repeatInterval) {
    const { addDays } = require('./dateCalculator');
    const nextScheduledDate = addDays(
      new Date(),
      completedStep.repeatInterval
    );

    // 次の同じステップを追加
    const newProgress: CustomerProgress = {
      id: uuidv4(),
      customerId: customer.id,
      stepId: completedStep.id,
      scheduledDate: nextScheduledDate,
      completedAt: null,
      status: determineProgressStatus(nextScheduledDate, null),
    };

    updatedProgress.push(newProgress);
  }

  // ★年中行事の処理（毎年自動繰り返し）★
  if (completedStep?.baseType === 'annual_fixed_date' &&
      completedStep.fixedMonth !== undefined &&
      completedStep.fixedDay !== undefined) {
    const { getNextAnnualDate } = require('./dateCalculator');
    const nextScheduledDate = getNextAnnualDate(
      completedStep.fixedMonth,
      completedStep.fixedDay
    );

    // 来年の同じ日付を追加
    const newProgress: CustomerProgress = {
      id: uuidv4(),
      customerId: customer.id,
      stepId: completedStep.id,
      scheduledDate: nextScheduledDate,
      completedAt: null,
      status: determineProgressStatus(nextScheduledDate, null),
    };

    updatedProgress.push(newProgress);
  }

  // ★ここが重要★
  // 次以降のステップで baseType === 'previous_completion' のものを再計算
  recalculateSubsequentSteps(
    targetIndex,
    updatedProgress,
    customer,
    roadmap
  );

  return updatedProgress;
}

/**
 * 以降のステップの予定日を再計算する
 */
function recalculateSubsequentSteps(
  completedIndex: number,
  progressList: CustomerProgress[],
  customer: Customer,
  roadmap: Roadmap
): void {
  for (let i = completedIndex + 1; i < progressList.length; i++) {
    const step = roadmap.steps.find((s) => s.id === progressList[i].stepId);
    if (!step) continue;

    const previousProgress = i > 0 ? progressList[i - 1] : undefined;
    const newScheduledDate = calculateScheduledDate(
      step,
      customer,
      previousProgress
    );

    progressList[i] = {
      ...progressList[i],
      scheduledDate: newScheduledDate,
      status: determineProgressStatus(
        newScheduledDate,
        progressList[i].completedAt
      ),
    };
  }
}

/**
 * 全進捗のステータスを更新する（日付が変わった時などに実行）
 */
export function updateAllProgressStatus(
  progressList: CustomerProgress[]
): CustomerProgress[] {
  return progressList.map((progress) => ({
    ...progress,
    status: determineProgressStatus(
      progress.scheduledDate,
      progress.completedAt
    ),
  }));
}

/**
 * 今日やるべきタスクを抽出する
 */
export function getTodayTasks(
  progressList: CustomerProgress[]
): CustomerProgress[] {
  const today = getToday();
  return progressList.filter((progress) => {
    if (progress.completedAt) return false;
    if (!progress.scheduledDate) return false;
    return (
      progress.scheduledDate.getTime() === today.getTime() ||
      progress.status === 'overdue'
    );
  });
}

/**
 * 遅れているタスクを抽出する
 */
export function getOverdueTasks(
  progressList: CustomerProgress[]
): CustomerProgress[] {
  return progressList.filter(
    (progress) => progress.status === 'overdue' && !progress.completedAt
  );
}

/**
 * 現在のステップを取得する（次にやるべき未完了ステップ）
 */
export function getCurrentStep(
  progressList: CustomerProgress[]
): CustomerProgress | null {
  return (
    progressList.find(
      (progress) => !progress.completedAt && progress.scheduledDate !== null
    ) || null
  );
}
