'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TodayTask, OverdueTask, CustomerProgress } from '@/types';
import {
  getAllCustomers,
  getAllRoadmaps,
  getAllProgress,
  initializeSampleData,
} from '@/lib/storage';
import {
  getTodayTasks,
  getOverdueTasks,
  completeStep,
} from '@/lib/progressManager';
import { calculateDaysOverdue, formatDate } from '@/lib/dateCalculator';
import TaskCard from '@/components/TaskCard';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';

export default function Dashboard() {
  const [todayTasks, setTodayTasks] = useState<TodayTask[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<CustomerProgress[]>([]);

  const loadTasks = () => {
    const customers = getAllCustomers();
    const roadmaps = getAllRoadmaps();
    const allProgress = getAllProgress();

    const todayTasksData: TodayTask[] = [];
    const overdueTasksData: OverdueTask[] = [];

    customers.forEach((customer) => {
      const roadmap = roadmaps.find((r) => r.id === customer.roadmapId);
      if (!roadmap) return;

      const customerProgress = allProgress.filter(
        (p) => p.customerId === customer.id
      );

      const todayProgress = getTodayTasks(customerProgress);
      const overdueProgress = getOverdueTasks(customerProgress);

      todayProgress.forEach((progress) => {
        const step = roadmap.steps.find((s) => s.id === progress.stepId);
        if (step) {
          todayTasksData.push({ customer, progress, step, roadmap });
        }
      });

      overdueProgress.forEach((progress) => {
        const step = roadmap.steps.find((s) => s.id === progress.stepId);
        if (step && progress.scheduledDate) {
          overdueTasksData.push({
            customer,
            progress,
            step,
            roadmap,
            daysOverdue: calculateDaysOverdue(progress.scheduledDate),
          });
        }
      });
    });

    setTodayTasks(todayTasksData);
    setOverdueTasks(overdueTasksData);
    setLoading(false);
  };

  useEffect(() => {
    initializeSampleData();
    loadTasks();
  }, []);

  const handleComplete = (progressId: string) => {
    const allProgress = getAllProgress();
    const customers = getAllCustomers();
    const roadmaps = getAllRoadmaps();

    const progressToComplete = allProgress.find((p) => p.id === progressId);
    if (!progressToComplete) return;

    const customer = customers.find(
      (c) => c.id === progressToComplete.customerId
    );
    const roadmap = roadmaps.find((r) => r.id === customer?.roadmapId);

    if (!customer || !roadmap) return;

    const customerProgress = allProgress.filter(
      (p) => p.customerId === customer.id
    );
    const updatedProgress = completeStep(
      progressId,
      customerProgress,
      customer,
      roadmap
    );

    const { saveProgress } = require('@/lib/storage');
    saveProgress(updatedProgress);

    loadTasks();
  };

  const handleDateClick = (date: Date, tasks: CustomerProgress[]) => {
    setSelectedDate(date);
    setSelectedTasks(tasks);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedTasks([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 ダッシュボード
        </h1>
        <Link href="/customers/new">
          <Button variant="primary">+ 顧客を登録</Button>
        </Link>
      </div>

      {/* カレンダー表示 */}
      <Calendar
        progressList={getAllProgress()}
        customers={getAllCustomers()}
        roadmaps={getAllRoadmaps()}
        onDateClick={handleDateClick}
      />

      {todayTasks.length === 0 && overdueTasks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              今日のフォローはありません。
            </p>
            <Link href="/customers/new">
              <Button variant="primary">最初の顧客を登録</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {todayTasks.length > 0 && (
            <Card title={`🔔 今日のフォロー ${todayTasks.length}件`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayTasks.map((task) => (
                  <TaskCard
                    key={task.progress.id}
                    task={task}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            </Card>
          )}

          {overdueTasks.length > 0 && (
            <Card title={`⚠️ 遅れているフォロー ${overdueTasks.length}件`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overdueTasks.map((task) => (
                  <div key={task.progress.id}>
                    <TaskCard task={task} onComplete={handleComplete} />
                    <p className="text-xs text-red-600 mt-1 text-center">
                      {task.daysOverdue}日遅れ
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* 日付クリック時のモーダル */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {formatDate(selectedDate)} のタスク
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                この日のタスクはありません
              </p>
            ) : (
              <div className="space-y-4">
                {selectedTasks.map((progress) => {
                  const customers = getAllCustomers();
                  const roadmaps = getAllRoadmaps();
                  const customer = customers.find(
                    (c) => c.id === progress.customerId
                  );
                  const roadmap = roadmaps.find(
                    (r) => r.id === customer?.roadmapId
                  );
                  const step = roadmap?.steps.find(
                    (s) => s.id === progress.stepId
                  );

                  if (!customer || !step || !roadmap) return null;

                  const task = { customer, progress, step, roadmap };

                  return (
                    <TaskCard
                      key={progress.id}
                      task={task}
                      onComplete={(id) => {
                        handleComplete(id);
                        closeModal();
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
