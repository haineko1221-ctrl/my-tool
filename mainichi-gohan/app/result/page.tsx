'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import type { Analysis } from '@/types/meal';

export default function ResultPage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // LocalStorageから分析結果を読み込み
    const savedImage = localStorage.getItem('latest-meal-image');
    const savedAnalysis = localStorage.getItem('latest-meal-analysis');

    if (savedImage && savedAnalysis) {
      setImageDataUrl(savedImage);
      setAnalysis(JSON.parse(savedAnalysis));
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex items-center justify-center">
        <Loading message="結果を読み込んでいます..." />
      </div>
    );
  }

  if (!analysis || !imageDataUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <p className="text-xl text-gray-700 mb-6">分析結果が見つかりません</p>
          <Link href="/upload">
            <Button variant="primary" size="large" icon="📸">
              写真を撮る
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* ヘッダー */}
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            🍚 まいにちごはん
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 写真表示 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            📸 今日のごはん
          </h2>
          <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-md">
            <img
              src={imageDataUrl}
              alt="今日の食事"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 今日のひとこと */}
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">💬</span>
            <h2 className="text-2xl font-bold text-gray-800">今日のひとこと</h2>
          </div>
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {analysis.todaysComment}
          </p>
        </div>

        {/* 食事バランス */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 食事バランス</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-lg font-medium">🥬 野菜</span>
              <span className="text-lg font-bold text-green-700">{analysis.balance.vegetables}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-lg font-medium">🥚 たんぱく質</span>
              <span className="text-lg font-bold text-blue-700">{analysis.balance.protein}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-lg font-medium">🍚 主食</span>
              <span className="text-lg font-bold text-orange-700">{analysis.balance.mainFood}</span>
            </div>
          </div>
        </div>

        {/* 明日のおすすめ */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌅 明日のおすすめ</h2>
          <div className="space-y-3">
            {analysis.tomorrowSuggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-lg text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4 pt-4">
          <Link href="/" className="block">
            <Button variant="primary" size="large" icon="🏠">
              ホームに戻る
            </Button>
          </Link>

          <Link href="/upload" className="block">
            <Button variant="secondary" size="medium" icon="📸">
              もう一度撮る
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
