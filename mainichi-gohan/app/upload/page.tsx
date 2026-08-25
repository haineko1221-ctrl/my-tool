'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { saveMealRecord } from '@/lib/storage';

export default function UploadPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageSelected = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSelectedImage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // OpenAI APIを呼び出して分析
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageDataUrl: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '分析に失敗しました');
      }

      // 履歴として保存（連続記録も自動更新される）
      const savedRecord = saveMealRecord(selectedImage, data.analysis);

      // 最新の分析結果として保存（結果画面で表示用）
      localStorage.setItem('latest-meal-image', selectedImage);
      localStorage.setItem('latest-meal-analysis', JSON.stringify(data.analysis));

      // 結果画面に遷移
      router.push('/result');
    } catch (err) {
      console.error('分析エラー:', err);
      const errorMessage = err instanceof Error ? err.message : '分析中にエラーが発生しました';
      setError(errorMessage);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setError(null);
  };

  if (isAnalyzing) {
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
          <Loading message="今日のごはんを見ています..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 flex flex-col">
      {/* ヘッダー */}
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-orange-500 hover:text-orange-600 text-lg">
            ← 戻る
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            写真を送る
          </h1>
          <div className="w-16"></div> {/* スペーサー */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-base text-red-700 text-center">{error}</p>
            </div>
          )}

          {/* 画像が選択されていない場合 */}
          {!selectedImage && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <ImageUploader
                onImageSelected={handleImageSelected}
                onError={handleError}
              />
            </div>
          )}

          {/* 画像プレビュー */}
          {selectedImage && (
            <div className="space-y-6">
              {/* プレビューカード */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  📸 撮影した写真
                </h2>
                <div className="relative w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden shadow-md">
                  <img
                    src={selectedImage}
                    alt="選択した食事の写真"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* アクションボタン */}
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="large"
                  icon="✨"
                  onClick={handleAnalyze}
                >
                  分析する
                </Button>

                <Button
                  variant="secondary"
                  size="medium"
                  icon="🔄"
                  onClick={handleReset}
                >
                  撮り直す
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
