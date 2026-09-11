'use client';

import { useState } from 'react';
import { CustomerProgress, Customer, Roadmap } from '@/types';
import { formatDate, isSameDay, getToday } from '@/lib/dateCalculator';

type CalendarProps = {
  progressList: CustomerProgress[];
  customers: Customer[];
  roadmaps: Roadmap[];
  onDateClick?: (date: Date, tasks: CustomerProgress[]) => void;
};

// 顧客ごとに色を割り当て
const CUSTOMER_COLORS = [
  'bg-blue-100 border-blue-500 text-blue-900',
  'bg-green-100 border-green-500 text-green-900',
  'bg-purple-100 border-purple-500 text-purple-900',
  'bg-pink-100 border-pink-500 text-pink-900',
  'bg-yellow-100 border-yellow-500 text-yellow-900',
  'bg-orange-100 border-orange-500 text-orange-900',
  'bg-red-100 border-red-500 text-red-900',
  'bg-indigo-100 border-indigo-500 text-indigo-900',
];

export default function Calendar({
  progressList,
  customers,
  roadmaps,
  onDateClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = getToday();

  // 月の初日を取得
  const getFirstDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // 月の最終日を取得
  const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // カレンダー表示用の日付配列を生成（日曜始まり）
  const generateCalendarDays = (): (Date | null)[] => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const days: (Date | null)[] = [];

    // 月初の曜日（0=日曜、6=土曜）
    const firstDayOfWeek = firstDay.getDay();

    // 前月の空白を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 当月の日付を追加
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    return days;
  };

  // 特定の日付のタスクを取得
  const getTasksForDate = (date: Date): CustomerProgress[] => {
    return progressList.filter(
      (progress) =>
        progress.scheduledDate && isSameDay(progress.scheduledDate, date)
    );
  };

  // 顧客IDから色を取得
  const getCustomerColor = (customerId: string): string => {
    const customerIndex = customers.findIndex((c) => c.id === customerId);
    return CUSTOMER_COLORS[customerIndex % CUSTOMER_COLORS.length];
  };

  // 前月へ
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // 次月へ
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 今月へ
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← 前月
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            今日
          </button>
        </div>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          次月 →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded" />;
          }

          const tasks = getTasksForDate(date);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={index}
              onClick={() => onDateClick && onDateClick(date, tasks)}
              className={`h-24 border-2 rounded-lg p-2 cursor-pointer transition hover:shadow-md ${
                isToday
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              {/* 日付 */}
              <div
                className={`text-sm font-semibold mb-1 ${
                  isToday ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {date.getDate()}
              </div>

              {/* タスク表示 */}
              <div className="space-y-1 overflow-y-auto max-h-14">
                {tasks.slice(0, 3).map((task) => {
                  const customer = customers.find((c) => c.id === task.customerId);
                  const colorClass = customer ? getCustomerColor(customer.id) : 'bg-gray-100';

                  // ステータスアイコン
                  const statusIcon =
                    task.status === 'completed'
                      ? '🟢'
                      : task.status === 'overdue'
                      ? '🔴'
                      : '🔵';

                  return (
                    <div
                      key={task.id}
                      className={`text-xs px-1 py-0.5 rounded border-l-2 ${colorClass}`}
                      title={customer?.name || 'Unknown'}
                    >
                      {statusIcon} {customer?.name.slice(0, 4) || '?'}
                    </div>
                  );
                })}
                {tasks.length > 3 && (
                  <div className="text-xs text-gray-500 font-semibold">
                    +{tasks.length - 3}件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span>🟢 完了</span>
          <span>🔵 予定</span>
          <span>🔴 遅延</span>
        </div>
      </div>
    </div>
  );
}
