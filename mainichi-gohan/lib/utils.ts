// 画像最適化設定
const IMAGE_CONFIG = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  format: 'image/jpeg' as const,
};

/**
 * 画像ファイルをリサイズ・圧縮してBase64に変換
 * @param file - 画像ファイル
 * @returns Base64エンコードされた画像データ
 */
export async function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvasで画像をリサイズ
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // アスペクト比を保ちながらリサイズ
        if (width > height) {
          if (width > IMAGE_CONFIG.maxWidth) {
            height = (height * IMAGE_CONFIG.maxWidth) / width;
            width = IMAGE_CONFIG.maxWidth;
          }
        } else {
          if (height > IMAGE_CONFIG.maxHeight) {
            width = (width * IMAGE_CONFIG.maxHeight) / height;
            height = IMAGE_CONFIG.maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 画像を描画
        ctx.drawImage(img, 0, 0, width, height);

        // Base64に変換（JPEG形式、品質80%）
        const base64 = canvas.toDataURL(IMAGE_CONFIG.format, IMAGE_CONFIG.quality);
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error('画像の読み込みに失敗しました'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * ファイルが画像かどうかを判定
 * @param file - チェックするファイル
 * @returns 画像ファイルの場合true
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * ファイルサイズを人間が読める形式に変換
 * @param bytes - バイト数
 * @returns フォーマットされたファイルサイズ
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * UUIDを生成（ブラウザ対応版）
 * @returns UUID文字列
 */
export function generateId(): string {
  // ブラウザでも動くシンプルなID生成（タイムスタンプ + ランダム文字列）
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
