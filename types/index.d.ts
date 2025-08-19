export type Suggestion = {
  id: string;
  productName?: string; // 製品名
  title?: string; // 互換性のためのフォールバック
  category?: string; // 製品カテゴリ
  description: string; // 製品説明
  imageUrl: string; // 製品画像URL
  reasoning: string; // 家に適している理由
  estimatedPrice?: string; // 推定価格
};

export type Analysis = {
  description: string; // 家と外装空間の説明
  style: string; // 建築スタイル
  condition: string; // 現在の空間の評価
  suggestions: Suggestion[]; // 推奨製品リスト
};
