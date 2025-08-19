"use client";

import { Analysis } from "@/types";

interface AnalysisDisplayProps {
  analysis: Analysis;
}

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🏠 家の分析結果
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">説明</h3>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
            {analysis.description}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">建築スタイル</h3>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
            {analysis.style}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">現在の状況</h3>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
            {analysis.condition}
          </p>
        </div>
      </div>
    </div>
  );
}
