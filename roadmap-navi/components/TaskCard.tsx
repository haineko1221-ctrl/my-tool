'use client';

import { TodayTask } from '@/types';
import { formatDate } from '@/lib/dateCalculator';
import Button from './Button';

type TaskCardProps = {
  task: TodayTask;
  onComplete: (progressId: string) => void;
};

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const { customer, step, progress } = task;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-600">{step.title}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            progress.status === 'overdue'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {progress.status === 'overdue' ? '遅延中' : '今日'}
        </span>
      </div>

      {step.description && (
        <p className="text-sm text-gray-500 mb-3">{step.description}</p>
      )}

      {progress.scheduledDate && (
        <p className="text-xs text-gray-400 mb-3">
          予定日: {formatDate(progress.scheduledDate)}
        </p>
      )}

      <Button
        onClick={() => onComplete(progress.id)}
        variant="primary"
        size="sm"
        className="w-full"
      >
        完了
      </Button>
    </div>
  );
}
