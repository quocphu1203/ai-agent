import { NextRequest, NextResponse } from "next/server";
import { Agent, run, imageGenerationTool } from "@openai/agents";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 外装家具製品推薦エージェント
const houseAnalysisAgent = new Agent({
  name: "外装家具製品推薦エージェント",
  instructions: `あなたは外装家具製品の専門コンサルタントです。家の画像を分析し、3つの具体的な外装家具製品を推薦してください。

  重要: 各製品に対してimageGenerationToolを使用して実際の画像を作成することが必須です。

  実行内容:
  1. 家の画像と外装空間を分析する
  2. 3つの製品を推薦: アウトドア家具、外装照明、植木鉢・植物
  3. 各製品に対して、必ずimageGenerationToolを呼び出して製品画像を作成する
  4. imageGenerationToolからの実際の画像URLを含むJSONを返す

  返すJSON:
  {
    "description": "家と外装空間の説明",
    "style": "建築スタイル",
    "condition": "現在の空間の評価",
    "suggestions": [
      {
        "id": "1",
        "productName": "具体的な製品名",
        "category": "製品カテゴリ",
        "description": "製品の詳細説明",
        "reasoning": "家に適している理由",
        "estimatedPrice": "推定価格（円）",
        "imageUrl": "imageGenerationToolからの実際のURL"
      }
    ]
  }

  注意事項: 
  - 必ずimageGenerationToolを使用して高品質な製品画像を作成する
  - 純粋なJSONのみを返し、markdownや説明テキストは含めない
  - 各製品がimageGenerationToolからの実際のimageUrlを持つことを確認する`,
  model: "gpt-4o",
  tools: [imageGenerationTool()],
});

// フォールバック画像生成関数
async function generateFallbackImage(suggestion: Record<string, unknown>) {
  try {
    const productName = (suggestion.productName as string) || (suggestion.title as string) || "外装家具製品";
    const productDesc = String(suggestion.description || "").trim();
    
    const fallbackResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${productName}, ${productDesc}, プロフェッショナル製品写真, 白背景, 高品質, モダンな外装家具`,
      size: "1024x1024",
      n: 1,
      quality: "hd",
      style: "natural",
    });
    
    const fallbackImage = fallbackResponse.data?.[0];
    if (fallbackImage?.url) {
      try {
        const imageRes = await fetch(fallbackImage.url);
        if (imageRes.ok) {
          const arrayBuffer = await imageRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = imageRes.headers.get('content-type') || 'image/png';
          suggestion.imageUrl = `data:${contentType};base64,${base64}`;
        } else {
          suggestion.imageUrl = fallbackImage.url;
        }
      } catch {
        suggestion.imageUrl = fallbackImage.url;
      }
    }
  } catch (error) {
    const productName = (suggestion.productName as string) || (suggestion.title as string) || "製品";
    suggestion.imageUrl = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(productName)}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    let imageFile: File | null = null;
    let imageUrl: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      imageFile = form.get('imageFile') as File | null;
      if (!imageFile) {
        return NextResponse.json({ error: "画像ファイルが不足しています" }, { status: 400 });
      }
    } else {
      const body = await request.json();
      imageUrl = body.imageUrl;
      if (!imageUrl) {
        return NextResponse.json({ error: "画像URLが不足しています" }, { status: 400 });
      }
    }

    console.log("エージェントが外装家具製品を推薦中...");

    const fullPrompt = `家の画像を分析し、適切な3つの外装家具製品を推薦してください:
    1. アウトドア家具（ダイニングセット、ソファセット、リラクゼーションチェア）
    2. 外装照明（ガーデンライト、装飾ライト、LEDライト）
    3. 植木鉢と植物（コンポジット鉢、観葉植物、日陰樹）

    各製品に対して必ずimageGenerationToolを呼び出し、実際の画像URLを含むJSONを返してください。`;

    let agentResult;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = imageFile.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;
      const promptWithImage = `${fullPrompt}\n\n家の画像（base64）: ${dataUrl}`;
      agentResult = await run(houseAnalysisAgent, promptWithImage);
    } else {
      agentResult = await run(houseAnalysisAgent, fullPrompt);
    }

    let analysis: Record<string, unknown> | undefined;
    const resultText = agentResult?.finalOutput || JSON.stringify(agentResult) || "";

    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log("✓ JSON解析成功");

        if (analysis?.suggestions && Array.isArray(analysis.suggestions)) {
          const suggestions = analysis.suggestions as Array<Record<string, unknown>>;
          const hasImages = suggestions.every(s => s.imageUrl && 
            typeof s.imageUrl === 'string' && 
            s.imageUrl.startsWith('http') && 
            !s.imageUrl.includes('placeholder'));
          
          if (hasImages) {
            // 画像をbase64に変換して安定化
            for (const suggestion of suggestions) {
              if (suggestion.imageUrl && typeof suggestion.imageUrl === 'string' && suggestion.imageUrl.startsWith('http')) {
                try {
                  const imageRes = await fetch(suggestion.imageUrl);
                  if (imageRes.ok) {
                    const arrayBuffer = await imageRes.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    const contentType = imageRes.headers.get('content-type') || 'image/png';
                    suggestion.imageUrl = `data:${contentType};base64,${base64}`;
                  } else {
                    await generateFallbackImage(suggestion);
                  }
                } catch {
                  await generateFallbackImage(suggestion);
                }
              }
            }
          } else {
            // 全製品にフォールバック画像を生成
            for (const suggestion of suggestions) {
              await generateFallbackImage(suggestion);
            }
          }
        }
      }
    } catch (parseError) {
      console.log("JSON解析エラー:", parseError);
      return NextResponse.json(
        { error: "エージェントから製品リストを解析できません" },
        { status: 500 }
      );
    }

    if (!analysis) {
      return NextResponse.json(
        { error: "エージェントからデータを解析できません" },
        { status: 500 }
      );
    }

    console.log("✓ エージェントの外装家具製品推薦完了");

    return NextResponse.json({
      ...analysis,
      agentProcessed: true,
      productRecommendations: true,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("エラー:", error);
    return NextResponse.json(
      { error: "外装家具製品推薦中にエラーが発生しました" },
      { status: 500 }
    );
  }
}