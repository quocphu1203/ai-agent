"use client";

import { useState } from "react";
import Image from "next/image";
import { Suggestion } from "@/types";

interface SuggestionsListProps {
  suggestions: Suggestion[];
  selectedSuggestion: Suggestion | null;
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

export default function SuggestionsList({
  suggestions,
  selectedSuggestion,
  onSelectSuggestion,
}: SuggestionsListProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🎯 推奨製品リスト
      </h2>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedSuggestion?.id === suggestion.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                {imageLoadingStates[suggestion.id] !== false && (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={suggestion.imageUrl}
                  alt={suggestion.productName || suggestion.title || "製品画像"}
                  width={96}
                  height={96}
                  className={`w-24 h-24 object-cover rounded-lg ${
                    imageLoadingStates[suggestion.id] !== false ? "hidden" : ""
                  }`}
                  onLoad={() => handleImageLoad(suggestion.id)}
                  onError={() => handleImageError(suggestion.id)}
                  unoptimized={suggestion.imageUrl.startsWith('data:') || suggestion.imageUrl.includes('placeholder')}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {suggestion.productName || suggestion.title || "製品名なし"}
                </h3>
                
                {suggestion.category && (
                  <p className="text-sm text-indigo-600 mb-2">
                    📂 {suggestion.category}
                  </p>
                )}
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {suggestion.description}
                </p>
                
                {suggestion.reasoning && (
                  <p className="text-gray-500 text-xs mb-2">
                    💡 {suggestion.reasoning}
                  </p>
                )}
                
                {suggestion.estimatedPrice && (
                  <p className="text-green-600 font-medium text-sm">
                    💰 {suggestion.estimatedPrice}
                  </p>
                )}
              </div>
              
              <div className="text-indigo-500">
                {selectedSuggestion?.id === suggestion.id ? "✓" : "→"}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 製品をクリックして選択し、合成画像を生成してください
        </p>
      </div>
    </div>
  );
}
