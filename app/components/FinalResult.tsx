"use client";

import { Suggestion } from "@/types";

interface FinalResultProps {
  originalImage: string | null;
  finalImage: string;
  suggestion: Suggestion;
}

export default function FinalResult({
  originalImage,
  finalImage,
  suggestion,
}: FinalResultProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ✨ 最終結果 - 合成画像
      </h2>
      
      <div className="space-y-6">
        {/* 選択された製品情報 */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-800 mb-2">
            🎯 選択された製品
          </h3>
          <div className="space-y-2">
            <p className="text-indigo-700">
              <strong>製品名:</strong> {suggestion.productName || suggestion.title || "製品名なし"}
            </p>
            {suggestion.category && (
              <p className="text-indigo-700">
                <strong>カテゴリ:</strong> {suggestion.category}
              </p>
            )}
            {suggestion.estimatedPrice && (
              <p className="text-indigo-700">
                <strong>推定価格:</strong> {suggestion.estimatedPrice}
              </p>
            )}
          </div>
        </div>

        {/* 画像比較 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 元の画像 */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-center">
              🏠 元の家の画像
            </h3>
            {originalImage && (
              <img
                src={originalImage}
                alt="元の家の画像"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
              />
            )}
          </div>

          {/* 合成画像 */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3 text-center">
              ✨ 製品統合後の画像
            </h3>
            <img
              src={finalImage}
              alt="合成画像"
              className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
            />
          </div>
        </div>

        {/* 説明 */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">
            🎨 合成画像について
          </h3>
          <p className="text-green-700 text-sm">
            AIエージェントが選択された製品を元の家の画像に自然に統合しました。
            元の建築、スタイル、照明、視点を維持しながら、製品が外装空間に美しく配置されています。
          </p>
        </div>
      </div>
    </div>
  );
}
