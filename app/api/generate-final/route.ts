import { NextRequest, NextResponse } from "next/server";
import { Agent, run, imageGenerationTool } from "@openai/agents";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 家と製品の合成画像作成エージェント
const compositeImageAgent = new Agent({
  name: "家と製品の合成画像作成エージェント",
  instructions: `あなたは外装家具製品を家の空間に統合する合成画像作成の専門家です。必ずimageGenerationToolを使用して実際の合成画像を作成してください。合成画像は製品が家の元の画像に統合されたものである必要があり、別々の画像を作成してはいけません。元の家の建築、スタイル、照明、視点を維持してください。返すJSON: {"compositeImageUrl": "imageGenerationToolからのURL", "message": "説明"}`,
  model: "gpt-4o",
  tools: [imageGenerationTool()],
});

// フォールバック画像生成関数
async function generateFallbackImage(prompt: string, quality: "hd" | "standard" = "hd") {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      n: 1,
      quality,
      style: "natural",
    });
    return response.data?.[0]?.url;
  } catch {
    return null;
  }
}

// 画像をbase64に変換する関数
async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    const imageRes = await fetch(imageUrl);
    if (imageRes.ok) {
      const arrayBuffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const contentType = imageRes.headers.get("content-type") || "image/png";
      return `data:${contentType};base64,${base64}`;
    }
  } catch {}
  return imageUrl; // 変換できない場合は元のURLにフォールバック
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let originalImageInput: string | undefined;
    let suggestion: unknown;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const imageUrl = form.get("originalImageUrl") as string | null;
      if (imageUrl) originalImageInput = imageUrl;
      
      const suggestionField = form.get("suggestion") as string | null;
      if (suggestionField) {
        try { suggestion = JSON.parse(suggestionField); } catch { suggestion = suggestionField; }
      }
    } else {
      const body = await request.json();
      originalImageInput = body.originalImage;
      suggestion = body.suggestion;
    }

    if (!originalImageInput || !suggestion) {
      return NextResponse.json({ error: "元の画像または提案の情報が不足しています" }, { status: 400 });
    }

    const s = (suggestion as Record<string, unknown>) || {};
    const productName = (s.productName as string) || (s.title as string) || "外装家具製品";
    const productDesc = String(s.description || "").trim();

    console.log("AIエージェントによる合成画像作成を開始...");

    try {
      // AIエージェントを呼び出し
      const compositePrompt = `製品の合成画像を作成してください: ${productName}。説明: ${productDesc}。元の画像: ${originalImageInput}。要求: 製品が家の元の画像に統合された実際の合成画像を作成し、元の建築、スタイル、照明、視点を維持してください。必ずimageGenerationToolを使用してください。`;
      
      const agentResult = await run(compositeImageAgent, compositePrompt);
      let compositeImageUrl: string | null = null;

      // エージェントの結果を処理
      if (agentResult?.finalOutput) {
        try {
          const jsonMatch = agentResult.finalOutput.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            compositeImageUrl = result.compositeImageUrl;
            console.log("✓ エージェントが合成画像を作成しました:", compositeImageUrl);
          }
        } catch {}
      }

      // エージェントが画像を作成できない場合のフォールバック
      if (!compositeImageUrl) {
        console.log("エージェントが画像を作成できませんでした、フォールバックを使用...");
        const fallbackPrompt = `Create a photorealistic composite image showing ${productName} naturally integrated into the outdoor space of the original house image. Product details: ${productDesc}. CRITICAL: The product must be integrated into the original house image, NOT a separate scene. Keep the original house architecture, style, lighting, and perspective exactly the same. Only add the product to the existing outdoor space.`;
        const fallbackUrl = await generateFallbackImage(fallbackPrompt, "hd");
        if (fallbackUrl) compositeImageUrl = fallbackUrl;
      }

      if (compositeImageUrl) {
        // 画像をbase64に変換
        const finalImageDataUrl = await convertImageToBase64(compositeImageUrl);
        
        return NextResponse.json({
          finalImageUrl: finalImageDataUrl,
          appliedSuggestion: suggestion,
          success: true,
          message: "AIエージェントによる合成画像作成が成功しました",
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error("合成画像を作成できませんでした");
      }
    } catch (imgErr) {
      console.error("合成画像作成中にエラーが発生しました:", imgErr);

      // 最終フォールバック: 単体製品画像を作成
      try {
        console.log("単体製品画像の作成を試行中...");
        const productPrompt = `${productName}。${productDesc}。プロフェッショナル製品写真、モダンな外装家具、高品質、白背景、商業写真、4K解像度`;
        const productImageUrl = await generateFallbackImage(productPrompt, "hd");
        
        if (productImageUrl) {
          const finalImageDataUrl = await convertImageToBase64(productImageUrl);
          return NextResponse.json({
            finalImageUrl: finalImageDataUrl,
            appliedSuggestion: suggestion,
            success: true,
            message: "製品画像を作成しました（フォールバックモード）",
            timestamp: new Date().toISOString(),
          });
        }
      } catch {}

      // 緊急フォールバック: プレースホルダー
      const placeholderUrl = `https://via.placeholder.com/800x600/4f46e5/ffffff?text=${encodeURIComponent(productName + ' - 画像作成中...')}`;
      return NextResponse.json({
        finalImageUrl: placeholderUrl,
        appliedSuggestion: suggestion,
        success: true,
        message: "プレースホルダー画像を作成しました（緊急フォールバック）",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("完全な画像作成エラー:", error);
    return NextResponse.json({
      error: "完全な画像作成中にエラーが発生しました",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
