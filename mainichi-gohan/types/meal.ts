// まいにちごはん - 型定義

/**
 * 食事バランスの評価
 */
export interface Balance {
  vegetables: 'しっかり' | 'ふつう' | 'すくなめ';
  protein: 'しっかり' | 'ふつう' | 'すくなめ';
  mainFood: 'しっかり' | 'やや多め' | 'ふつう';
  sugarRisk: '多め' | 'やや多め' | 'ふつう';
}

/**
 * AI分析結果
 */
export interface Analysis {
  dishes: string[];              // 認識された料理
  ingredients: string[];         // 認識された食材
  balance: Balance;              // 食事バランス
  todaysComment: string;         // AIからの今日のひとこと
  tomorrowSuggestions: string[]; // 明日の食事提案
}

/**
 * 食事記録
 */
export interface MealRecord {
  id: string;                    // UUID
  timestamp: number;             // タイムスタンプ（Unix時間）
  photoDataUrl: string;          // Base64画像データ
  analysis: Analysis;            // AI分析結果
}

/**
 * 連続記録データ
 */
export interface StreakData {
  currentStreak: number;         // 現在の連続日数
  lastCheckDate: string;         // 最後にチェックした日（YYYY-MM-DD）
  totalChecks: number;           // 総チェック回数
}

/**
 * LocalStorageキー
 */
export const STORAGE_KEYS = {
  MEALS: 'mainichi-gohan:meals',
  STREAK: 'mainichi-gohan:streak',
} as const;
