"use client";

interface LoadingSpinnerProps {
  isAgent?: boolean;
}

export default function LoadingSpinner({ isAgent = false }: LoadingSpinnerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="space-y-4">
        {/* デュアルスピナーアニメーション */}
        <div className="flex justify-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* メインスピナー */}
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
        
        {/* メッセージ */}
        <div className="space-y-2">
          {isAgent ? (
            <>
              <h3 className="text-lg font-semibold text-indigo-800">
                🤖 AIエージェントが処理中...
              </h3>
              <p className="text-indigo-600 text-sm">
                画像の分析と製品推薦を行っています
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                ⏳ 処理中...
              </h3>
              <p className="text-gray-600 text-sm">
                しばらくお待ちください
              </p>
            </>
          )}
        </div>
        
        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}
