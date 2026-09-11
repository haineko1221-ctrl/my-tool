'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Customer, Roadmap } from '@/types';
import { saveCustomer, getAllRoadmaps } from '@/lib/storage';
import { generateInitialProgress } from '@/lib/progressManager';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function NewCustomerPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    roadmapId: '',
    memo: '',
    registeredAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadedRoadmaps = getAllRoadmaps();
    setRoadmaps(loadedRoadmaps);
    if (loadedRoadmaps.length > 0) {
      setFormData((prev) => ({ ...prev, roadmapId: loadedRoadmaps[0].id }));
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.roadmapId) {
      alert('名前とロードマップを選択してください');
      return;
    }

    const roadmap = roadmaps.find((r) => r.id === formData.roadmapId);
    if (!roadmap) {
      alert('ロードマップが見つかりません');
      return;
    }

    const customer: Customer = {
      id: uuidv4(),
      name: formData.name,
      roadmapId: formData.roadmapId,
      registeredAt: new Date(formData.registeredAt),
      memo: formData.memo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    saveCustomer(customer);

    const initialProgress = generateInitialProgress(customer, roadmap);
    const { saveProgress } = require('@/lib/storage');
    saveProgress(initialProgress);

    router.push('/customers');
  };

  if (roadmaps.length === 0) {
    return (
      <Card title="顧客登録">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            ロードマップが登録されていません。
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/roadmaps/new')}
          >
            ロードマップを作成
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="👤 顧客登録">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              顧客名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 田中太郎"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              登録日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.registeredAt}
              onChange={(e) =>
                setFormData({ ...formData, registeredAt: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ロードマップ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roadmapId}
              onChange={(e) =>
                setFormData({ ...formData, roadmapId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {roadmaps.map((roadmap) => (
                <option key={roadmap.id} value={roadmap.id}>
                  {roadmap.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) =>
                setFormData({ ...formData, memo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="例: セミナー参加者"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" className="flex-1">
              登録
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
