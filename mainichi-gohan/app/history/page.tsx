'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import HistoryItem from '@/components/HistoryItem';
import type { MealRecord, StreakData } from '@/types/meal';
import { getMealRecords, getStreak, getWeeklyCheckCount } from '@/lib/storage';

export default function HistoryPage() {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // データを読み込み
    const loadedMeals = getMealRecords(10);
    const loadedStreak = getStreak();
    const loadedWeeklyCount = getWeeklyCheckCount();

    setMeals(loadedMeals);
    setStreak(loadedStreak);
    setWeeklyCount(loadedWeeklyCount);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* ヘッダー */}
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-orange-500 hover:text-orange-600 text-lg">
            ← 戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            これまでの記録
          </h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 統計カード */}
        {!isLoading && streak && (
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎉</span>
              <h2 className="text-2xl font-bold text-gray-800">がんばってます！</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 連続記録 */}
              <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {streak.currentStreak}
                </div>
                <div className="text-sm text-gray-700 mt-1">連続日数</div>
              </div>

              {/* 今週のチェック */}
              <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {weeklyCount}
                </div>
                <div className="text-sm text-gray-700 mt-1">今週</div>
              </div>

              {/* 総チェック回数 */}
              <div className="bg-white bg-opacity-70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {streak.totalChecks}
                </div>
                <div className="text-sm text-gray-700 mt-1">総チェック</div>
              </div>
            </div>

            {/* 励ましメッセージ */}
            {streak.currentStreak >= 3 && (
              <div className="mt-4 text-center">
                <p className="text-lg text-gray-700">
                  {streak.currentStreak >= 7
                    ? '🌟 1週間続いてます！すごいですね！'
                    : '✨ 続けてますね！ええ感じです！'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 履歴一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 px-2">📅 食事の記録</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600">読み込み中...</p>
            </div>
          ) : meals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-xl text-gray-700 mb-6">まだ記録がありません</p>
              <Link href="/upload">
                <Button variant="primary" size="large" icon="📸">
                  最初の記録をつける
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <Link key={meal.id} href={`/history/${meal.id}`}>
                  <HistoryItem meal={meal} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="pt-4">
          <Link href="/upload" className="block">
            <Button variant="primary" size="large" icon="📸">
              新しく記録する
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
