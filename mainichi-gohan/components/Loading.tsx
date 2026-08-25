interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '読み込み中...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      {/* スピナー */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>

      {/* メッセージ */}
      <p className="text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
}
