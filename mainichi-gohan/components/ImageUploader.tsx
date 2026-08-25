'use client';

import { useState, useRef } from 'react';
import { optimizeImage, isImageFile } from '@/lib/utils';
import Button from './Button';

interface ImageUploaderProps {
  onImageSelected: (imageDataUrl: string) => void;
  onError: (error: string) => void;
}

export default function ImageUploader({ onImageSelected, onError }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画像ファイルかチェック
    if (!isImageFile(file)) {
      onError('画像ファイルを選択してください');
      return;
    }

    // ファイルサイズチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      onError('ファイルサイズが大きすぎます。10MB以下の画像を選択してください');
      return;
    }

    setIsProcessing(true);

    try {
      // 画像を最適化してBase64に変換
      const optimizedImage = await optimizeImage(file);
      onImageSelected(optimizedImage);
    } catch (error) {
      console.error('画像の処理中にエラーが発生しました:', error);
      onError('画像の処理中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* カメラ用の隠しファイル入力 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment" // モバイルでカメラを起動
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ファイル選択用の隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* アップロードボタン */}
      <div className="space-y-4">
        {/* カメラボタン（モバイル優先） */}
        <Button
          variant="primary"
          size="large"
          icon="📷"
          onClick={handleCameraClick}
          disabled={isProcessing}
        >
          {isProcessing ? '処理中...' : '写真を撮る'}
        </Button>

        {/* ファイル選択ボタン */}
        <Button
          variant="secondary"
          size="medium"
          icon="🖼️"
          onClick={handleFileClick}
          disabled={isProcessing}
        >
          ファイルから選ぶ
        </Button>
      </div>

      {/* 説明テキスト */}
      <div className="text-center space-y-2">
        <p className="text-base text-gray-600">
          今日食べた料理の写真を選んでください
        </p>
        <p className="text-sm text-gray-500">
          複数の料理が写っていても大丈夫です
        </p>
      </div>
    </div>
  );
}
