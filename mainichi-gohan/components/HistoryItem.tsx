import Link from 'next/link';
import type { MealRecord } from '@/types/meal';
import { formatRelativeDate } from '@/lib/storage';

interface HistoryItemProps {
  meal: MealRecord;
}

export default function HistoryItem({ meal }: HistoryItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        {/* 画像サムネイル */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={meal.photoDataUrl}
              alt="食事の写真"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 情報 */}
        <div className="flex-1 min-w-0">
          {/* 日付 */}
          <div className="text-sm text-gray-500 mb-2">
            {formatRelativeDate(meal.timestamp)}
          </div>

          {/* 今日のひとこと（1行目のみ） */}
          <p className="text-base text-gray-800 line-clamp-2 mb-3">
            {meal.analysis.todaysComment.split('\n')[0]}
          </p>

          {/* バランス */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
              🥬 {meal.analysis.balance.vegetables}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
              🥚 {meal.analysis.balance.protein}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-sm">
              🍚 {meal.analysis.balance.mainFood}
            </span>
          </div>
        </div>

        {/* 矢印 */}
        <div className="flex-shrink-0 flex items-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
