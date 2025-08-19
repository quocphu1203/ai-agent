"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onFileUpload: (file: File) => void;
}

export default function ImageUpload({ onImageUpload, onFileUpload }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        onImageUpload(result);
        onFileUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        🏠 家の画像をアップロード
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="space-y-4">
            <Image
              src={previewUrl}
              alt="アップロードされた画像"
              className="max-w-full h-64 object-cover rounded-lg mx-auto"
              width={1024}
              height={1024}
              unoptimized={previewUrl.startsWith('data:') || previewUrl.includes('placeholder')}
            />
            <button
              onClick={() => {
                setPreviewUrl(null);
                onImageUpload("");
                onFileUpload(null as unknown as File);
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              ✕ 画像を削除
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div className="space-y-2">
              <p className="text-gray-600">
                画像をドラッグ＆ドロップするか、クリックして選択してください
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, GIF形式をサポート
              </p>
            </div>
            <button
              onClick={handleClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              画像を選択
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
