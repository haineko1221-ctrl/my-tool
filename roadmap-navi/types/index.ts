// ===================================
// ロードマップテンプレート
// ===================================

export type Roadmap = {
  id: string;
  name: string;
  description?: string;
  steps: RoadmapStep[];
  createdAt: Date;
  updatedAt: Date;
};

// ===================================
// ロードマップステップ
// ===================================

export type RoadmapStep = {
  id: string;
  stepNumber: number; // ステップ番号（1, 2, 3...）
  title: string; // "製品到着確認"
  description?: string;

  // ★ルート再計算対応★
  baseType: 'registration' | 'previous_completion' | 'annual_fixed_date'; // 基準タイプ
  dayOffset: number; // 何日後か（annual_fixed_dateの場合は使用しない）

  // ★年中行事対応★
  fixedMonth?: number; // 固定月（1-12）
  fixedDay?: number; // 固定日（1-31）

  // ★繰り返し機能★
  isRepeating?: boolean; // 繰り返すかどうか
  repeatInterval?: number; // 繰り返し間隔（日数）
};

// ===================================
// 顧客
// ===================================

export type Customer = {
  id: string;
  name: string;
  registeredAt: Date; // 登録日（起算日）
  roadmapId: string; // 使用するロードマップのID
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
};

// ===================================
// 顧客の進捗
// ===================================

export type CustomerProgress = {
  id: string;
  customerId: string; // 顧客ID
  stepId: string; // ステップID
  scheduledDate: Date | null; // 予定日（前ステップ未完了の場合null）
  completedAt: Date | null; // 完了日時（未完了ならnull）
  status: 'pending' | 'completed' | 'overdue'; // ステータス
};

// ===================================
// ビュー用の型（画面表示用）
// ===================================

export type CustomerWithRoadmap = Customer & {
  roadmap: Roadmap;
  progress: CustomerProgress[];
};

export type TodayTask = {
  customer: Customer;
  progress: CustomerProgress;
  step: RoadmapStep;
  roadmap: Roadmap;
};

export type OverdueTask = TodayTask & {
  daysOverdue: number;
};
