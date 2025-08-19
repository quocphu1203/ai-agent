"use client";

import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import AnalysisDisplay from "./components/AnalysisDisplay";
import SuggestionsList from "./components/SuggestionsList";
import FinalResult from "./components/FinalResult";
import LoadingSpinner from "./components/LoadingSpinner";
import { Analysis, Suggestion } from "@/types";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setLoadingMessage("AIエージェントが家の画像を分析中...");
    setAnalysis(null);
    setSelectedSuggestion(null);
    setFinalImage(null);

    try {
      const formData = new FormData();
      formData.append("imageFile", uploadedFile);

      const response = await fetch("/api/analyze-house", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        console.error("分析エラー:", response.statusText);
      }
    } catch (error) {
      console.error("分析中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleGenerateFinal = async () => {
    if (!selectedSuggestion || !uploadedFile) return;

    setLoading(true);
    setLoadingMessage("AIエージェントが合成画像を作成中...");
    setFinalImage(null);

    try {
      const formData = new FormData();
      formData.append("originalImageFile", uploadedFile);
      formData.append("suggestion", JSON.stringify(selectedSuggestion));

      const response = await fetch("/api/generate-final", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFinalImage(data.finalImageUrl);
      } else {
        console.error("画像生成エラー:", response.statusText);
      }
    } catch (error) {
      console.error("画像生成中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏠 AI外装家具デザインアシスタント
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AIエージェントがあなたの家の画像を分析し、最適な外装家具製品を推薦し、
            美しい合成画像を作成します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: 画像アップロードと分析 */}
          <div className="space-y-6">
            <ImageUpload
              onImageUpload={setUploadedImage}
              onFileUpload={setUploadedFile}
            />

            {uploadedFile && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? "分析中..." : "🏠 家を分析して製品を推薦"}
              </button>
            )}

            {loading && loadingMessage.includes("分析") && (
              <LoadingSpinner isAgent={true} />
            )}

            {analysis && (
              <AnalysisDisplay analysis={analysis} />
            )}
          </div>

          {/* 右側: 提案リストと最終結果 */}
          <div className="space-y-6">
            {analysis?.suggestions && (
              <SuggestionsList
                suggestions={analysis.suggestions}
                onSelectSuggestion={setSelectedSuggestion}
                selectedSuggestion={selectedSuggestion}
              />
            )}

            {selectedSuggestion && (
              <button
                onClick={handleGenerateFinal}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? "生成中..." : "✨ 合成画像を生成"}
              </button>
            )}

            {loading && loadingMessage.includes("合成") && (
              <LoadingSpinner isAgent={true} />
            )}

            {finalImage && selectedSuggestion && (
              <FinalResult
                originalImage={uploadedImage}
                finalImage={finalImage}
                suggestion={selectedSuggestion}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
