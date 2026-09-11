'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Roadmap, RoadmapStep } from '@/types';
import { saveRoadmap } from '@/lib/storage';
import Card from '@/components/Card';
import Button from '@/components/Button';

type StepFormData = {
  title: string;
  description: string;
  baseType: 'registration' | 'previous_completion' | 'annual_fixed_date';
  dayOffset: number;
  fixedMonth: number;
  fixedDay: number;
  isRepeating: boolean;
  repeatInterval: number;
};

export default function NewRoadmapPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepFormData[]>([
    {
      title: '新規登録',
      description: '顧客登録完了',
      baseType: 'registration',
      dayOffset: 0,
      fixedMonth: 1,
      fixedDay: 1,
      isRepeating: false,
      repeatInterval: 7,
    },
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: '',
        description: '',
        baseType: 'registration',
        dayOffset: 0,
        fixedMonth: 1,
        fixedDay: 1,
        isRepeating: false,
        repeatInterval: 7,
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      alert('少なくとも1つのステップが必要です');
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof StepFormData, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert('ロードマップ名を入力してください');
      return;
    }

    if (steps.some((s) => !s.title)) {
      alert('すべてのステップにタイトルを入力してください');
      return;
    }

    const roadmapSteps: RoadmapStep[] = steps.map((step, index) => ({
      id: uuidv4(),
      stepNumber: index + 1,
      title: step.title,
      description: step.description || undefined,
      baseType: step.baseType,
      dayOffset: step.dayOffset,
      fixedMonth: step.baseType === 'annual_fixed_date' ? step.fixedMonth : undefined,
      fixedDay: step.baseType === 'annual_fixed_date' ? step.fixedDay : undefined,
      isRepeating: step.isRepeating,
      repeatInterval: step.isRepeating ? step.repeatInterval : undefined,
    }));

    const roadmap: Roadmap = {
      id: uuidv4(),
      name,
      description: description || undefined,
      steps: roadmapSteps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    saveRoadmap(roadmap);
    router.push('/roadmaps');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="🗺️ ロードマップ作成">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ロードマップ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 新規顧客フォロー"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="例: 新規顧客向けの標準フォロープラン"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">ステップ設定</h3>
              <Button type="button" variant="secondary" size="sm" onClick={addStep}>
                + ステップを追加
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Step {index + 1}
                    </h4>
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        削除
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        タイトル <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) =>
                          updateStep(index, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 製品到着確認"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        説明
                      </label>
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) =>
                          updateStep(index, 'description', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="例: 製品が届いたか確認"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        基準タイプ
                      </label>
                      <select
                        value={step.baseType}
                        onChange={(e) =>
                          updateStep(
                            index,
                            'baseType',
                            e.target.value as 'registration' | 'previous_completion' | 'annual_fixed_date'
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="registration">登録日基準</option>
                        <option value="previous_completion">
                          前ステップ完了基準
                        </option>
                        <option value="annual_fixed_date">
                          毎年固定日付（年中行事）
                        </option>
                      </select>
                    </div>

                    {step.baseType === 'annual_fixed_date' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            月
                          </label>
                          <select
                            value={step.fixedMonth}
                            onChange={(e) =>
                              updateStep(index, 'fixedMonth', parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                              <option key={m} value={m}>{m}月</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            日
                          </label>
                          <input
                            type="number"
                            value={step.fixedDay}
                            onChange={(e) =>
                              updateStep(index, 'fixedDay', parseInt(e.target.value) || 1)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                            max="31"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          何日後
                        </label>
                        <input
                          type="number"
                          value={step.dayOffset}
                          onChange={(e) =>
                            updateStep(index, 'dayOffset', parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          required
                        />
                      </div>
                    )}

                    <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                      <strong>説明:</strong>{' '}
                      {step.baseType === 'registration'
                        ? `顧客登録日から${step.dayOffset}日後に実施`
                        : step.baseType === 'annual_fixed_date'
                        ? `毎年${step.fixedMonth}月${step.fixedDay}日に実施（年中行事）`
                        : index === 0
                        ? '最初のステップは登録日基準を推奨'
                        : `前のステップ完了から${step.dayOffset}日後に実施`}
                    </div>

                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`repeating-${index}`}
                          checked={step.isRepeating}
                          onChange={(e) =>
                            updateStep(index, 'isRepeating', e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`repeating-${index}`}
                          className="text-sm font-semibold text-blue-900 cursor-pointer"
                        >
                          🔄 このステップを繰り返す
                        </label>
                      </div>

                      {step.isRepeating && (
                        <div className="mt-2">
                          <label className="block text-xs font-medium text-blue-900 mb-1">
                            繰り返し間隔
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={step.repeatInterval}
                              onChange={(e) =>
                                updateStep(
                                  index,
                                  'repeatInterval',
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 px-3 py-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                              required
                            />
                            <span className="text-sm text-blue-900">日ごと</span>
                          </div>
                          <p className="text-xs text-blue-700 mt-2">
                            完了すると自動的に{step.repeatInterval}日後に次の「
                            {step.title}」が追加されます
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" variant="primary" className="flex-1">
              作成
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
