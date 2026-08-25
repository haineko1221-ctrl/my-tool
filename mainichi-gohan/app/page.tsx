'use client';

import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* ヘッダー */}
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            🍚 まいにちごはん
          </h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* タイトルとサブタイトル */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              今日のごはんを
              <br />
              撮ってみよう 📷
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              写真を送るだけで、AIが食事を分析。
              <br />
              やさしいひとことと、明日の提案をお届けします。
            </p>
          </div>

          {/* メインボタン */}
          <div className="pt-8">
            <Link href="/upload" className="block">
              <Button
                variant="primary"
                size="large"
                icon="📸"
              >
                写真を送る
              </Button>
            </Link>
          </div>

          {/* サブボタン */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/history" className="flex-1">
              <Button
                variant="secondary"
                size="medium"
                icon="📅"
              >
                これまでの記録
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="w-full py-6 px-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base text-gray-500">
            食べる＝生きる
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> / </span>
            今日も食べた。明日は何を食べよう？
          </p>
        </div>
      </footer>
    </div>
  );
}
