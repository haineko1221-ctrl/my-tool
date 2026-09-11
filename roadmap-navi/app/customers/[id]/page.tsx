'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Customer, Roadmap, CustomerProgress, RoadmapStep } from '@/types';
import {
  getCustomerById,
  getRoadmapById,
  getProgressByCustomerId,
} from '@/lib/storage';
import { completeStep } from '@/lib/progressManager';
import { formatDate } from '@/lib/dateCalculator';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<CustomerProgress[]>([]);

  const loadData = () => {
    const loadedCustomer = getCustomerById(customerId);
    if (!loadedCustomer) {
      router.push('/customers');
      return;
    }

    const loadedRoadmap = getRoadmapById(loadedCustomer.roadmapId);
    const loadedProgress = getProgressByCustomerId(customerId);

    setCustomer(loadedCustomer);
    setRoadmap(loadedRoadmap);
    setProgress(loadedProgress);
  };

  useEffect(() => {
    loadData();
  }, [customerId]);

  const handleComplete = (progressId: string) => {
    if (!customer || !roadmap) return;

    const updatedProgress = completeStep(progressId, progress, customer, roadmap);
    const { saveProgress } = require('@/lib/storage');
    saveProgress(updatedProgress);

    loadData();
  };

  const getStepStatus = (step: RoadmapStep) => {
    const prog = progress.find((p) => p.stepId === step.id);
    if (!prog) return '⚪';
    if (prog.completedAt) return '🟢';
    if (prog.status === 'overdue') return '🔴';
    return '🔵';
  };

  const getStepProgress = (step: RoadmapStep) => {
    return progress.find((p) => p.stepId === step.id);
  };

  if (!customer || !roadmap) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const currentStep = progress.find(
    (p) => !p.completedAt && p.scheduledDate !== null
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
        <Button variant="secondary" onClick={() => router.back()}>
          戻る
        </Button>
      </div>

      <Card title="📋 基本情報">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">登録日</p>
            <p className="font-semibold">
              {formatDate(customer.registeredAt)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">ロードマップ</p>
            <p className="font-semibold">{roadmap.name}</p>
          </div>
          {customer.memo && (
            <div className="col-span-2">
              <p className="text-gray-600">メモ</p>
              <p className="font-semibold">{customer.memo}</p>
            </div>
          )}
        </div>
      </Card>

      {currentStep && (
        <Card title="🔵 現在のステップ">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">次のアクション</p>
            <p className="text-xl font-bold text-blue-900 mb-2">
              {roadmap.steps.find((s) => s.id === currentStep.stepId)?.title}
            </p>
            {currentStep.scheduledDate && (
              <p className="text-sm text-gray-600">
                予定日: {formatDate(currentStep.scheduledDate)}
              </p>
            )}
          </div>
        </Card>
      )}

      <Card title="🗺️ ロードマップ進捗">
        <div className="space-y-4">
          {roadmap.steps.map((step, index) => {
            const stepProgress = getStepProgress(step);
            const status = getStepStatus(step);
            const isCompleted = stepProgress?.completedAt;
            const isCurrent =
              currentStep && currentStep.stepId === step.id;

            return (
              <div
                key={step.id}
                className={`border rounded-lg p-4 ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{status}</span>
                      <h3 className="text-lg font-bold">
                        Step {step.stepNumber}: {step.title}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                          現在
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        基準:{' '}
                        {step.baseType === 'registration'
                          ? `登録日から${step.dayOffset}日後`
                          : `前ステップ完了から${step.dayOffset}日後`}
                      </p>
                      {stepProgress?.scheduledDate && (
                        <p>予定日: {formatDate(stepProgress.scheduledDate)}</p>
                      )}
                      {stepProgress?.completedAt && (
                        <p className="text-green-600">
                          ✅ 完了日: {formatDate(stepProgress.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  {stepProgress && !isCompleted && stepProgress.scheduledDate && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleComplete(stepProgress.id)}
                    >
                      完了
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
