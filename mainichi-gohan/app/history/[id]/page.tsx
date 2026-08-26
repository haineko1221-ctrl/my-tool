'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import type { MealRecord } from '@/types/meal';
import { getMealRecordById, formatMealDate } from '@/lib/storage';

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<MealRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const record = getMealRecordById(id);
    setMeal(record);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex flex-col">
        <header className="w-full py-6 px-4 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
              🍚 まいにちごはん
            </h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <Loading message="記録を読み込んでいます..." />
        </main>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex flex-col">
        <header className="w-full py-6 px-4 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/history" className="text-orange-500 hover:text-orange-600 text-lg">
              ← 戻る
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              記録が見つかりません
            </h1>
            <div className="w-16"></div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-6">
              この記録は削除されたか、見つかりませんでした
            </p>
            <Link href="/history">
              <Button variant="primary" size="large" icon="📅">
                履歴に戻る
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* ヘッダー */}
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/history" className="text-orange-500 hover:text-orange-600 text-lg">
            ← 戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            記録の詳細
          </h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 日付 */}
        <div className="text-center">
          <p className="text-lg text-gray-600">
            {formatMealDate(meal.timestamp)}
          </p>
        </div>

        {/* 写真 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">📸</span>
            今日のごはん
          </h2>
          <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-md">
            <img
              src={meal.photoDataUrl}
              alt="食事の写真"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 今日のひとこと */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            今日のひとこと
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {meal.analysis.todaysComment}
          </p>
        </div>

        {/* 食事バランス */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            食事バランス
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-lg font-medium text-gray-700 flex items-center gap-2">
                🥬 野菜
              </span>
              <span className="text-lg font-bold text-green-700">
                {meal.analysis.balance.vegetables}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-lg font-medium text-gray-700 flex items-center gap-2">
                🥚 たんぱく質
              </span>
              <span className="text-lg font-bold text-blue-700">
                {meal.analysis.balance.protein}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <span className="text-lg font-medium text-gray-700 flex items-center gap-2">
                🍚 主食
              </span>
              <span className="text-lg font-bold text-orange-700">
                {meal.analysis.balance.mainFood}
              </span>
            </div>
          </div>
        </div>

        {/* 明日のおすすめ */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌅</span>
            明日のおすすめ
          </h2>
          <ul className="space-y-3">
            {meal.analysis.tomorrowSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex gap-3 items-start p-3 bg-white bg-opacity-70 rounded-lg"
              >
                <span className="text-blue-500 font-bold text-lg flex-shrink-0">
                  •
                </span>
                <span className="text-base text-gray-700 leading-relaxed">
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4 pt-4">
          <Link href="/history" className="block">
            <Button variant="secondary" size="large" icon="📅">
              履歴に戻る
            </Button>
          </Link>
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
