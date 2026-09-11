'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Roadmap } from '@/types';
import { getAllRoadmaps, deleteRoadmap } from '@/lib/storage';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  const loadData = () => {
    setRoadmaps(getAllRoadmaps());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`「${name}」を削除しますか？`)) {
      deleteRoadmap(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🗺️ ロードマップ一覧</h1>
        <Link href="/roadmaps/new">
          <Button variant="primary">+ ロードマップを作成</Button>
        </Link>
      </div>

      {roadmaps.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              登録されたロードマップはありません。
            </p>
            <Link href="/roadmaps/new">
              <Button variant="primary">最初のロードマップを作成</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {roadmap.name}
                  </h3>
                  {roadmap.description && (
                    <p className="text-sm text-gray-600">{roadmap.description}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    ステップ ({roadmap.steps.length}件)
                  </p>
                  <div className="space-y-2">
                    {roadmap.steps.map((step) => (
                      <div
                        key={step.id}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <span className="font-semibold">
                          Step {step.stepNumber}:
                        </span>
                        <span>{step.title}</span>
                        <span className="text-gray-400">
                          ({step.baseType === 'registration'
                            ? `登録日+${step.dayOffset}日`
                            : step.baseType === 'annual_fixed_date'
                            ? `${step.fixedMonth}/${step.fixedDay} 🎌`
                            : `前+${step.dayOffset}日`})
                        </span>
                        {step.isRepeating && (
                          <span className="text-blue-600 font-semibold">
                            🔄 {step.repeatInterval}日ごと
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/roadmaps/${roadmap.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      編集
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(roadmap.id, roadmap.name)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
