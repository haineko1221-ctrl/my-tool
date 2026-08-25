import OpenAI from 'openai';
import type { Analysis } from '@/types/meal';

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 食事写真を分析して「今日のひとこと」を生成
 */
export async function analyzeMealImage(imageDataUrl: string): Promise<Analysis> {
  try {
    const systemPrompt = `
あなたは高齢者向けの優しい食事アドバイザーです。
写真から料理を分析し、前向きで温かいコメントを返します。

ルール:
- 否定的な表現は避ける（「〜が足りない」ではなく「〜を加えるとより良い」）
- 数値は使わず「しっかり」「ふつう」「やや多め」などの表現
- 短く分かりやすい日本語（3-4行）
- 親しみやすい関西弁のニュアンス（「〜やね」「ええ感じ」など）
- 食べたことを肯定的に捉える
- 「食べる＝生きる」という温かい視点

必ず以下のJSON形式で回答してください:
{
  "dishes": ["認識された料理名"],
  "ingredients": ["主な食材"],
  "balance": {
    "vegetables": "しっかり" | "ふつう" | "すくなめ",
    "protein": "しっかり" | "ふつう" | "すくなめ",
    "mainFood": "しっかり" | "やや多め" | "ふつう",
    "sugarRisk": "多め" | "やや多め" | "ふつう"
  },
  "todaysComment": "今日のひとこと（3-4行、絵文字も使ってOK）",
  "tomorrowSuggestions": ["明日の提案1", "明日の提案2", "明日の提案3"]
}
`;

    const userPrompt = `
この食事の写真を分析してください。

分析のポイント:
1. 写っている料理や食材を認識
2. 野菜、たんぱく質、主食のバランスを大まかに評価
3. 糖質が多くなりやすい食事かどうか
4. 温かく前向きな「今日のひとこと」を生成
5. 今日の食事を踏まえた「明日の提案」を3つ

注意:
- 写真からは正確な量は分からないので、推定として表現する
- 画像が不鮮明でも、見える範囲で優しくコメントする
`;

    // OpenAI Vision APIを呼び出し
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
      temperature: 0.7,
    });

    // レスポンスをパース
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AIからの応答がありませんでした');
    }

    const analysis: Analysis = JSON.parse(content);

    // 必須フィールドの検証
    if (!analysis.dishes || !analysis.balance || !analysis.todaysComment) {
      throw new Error('AIの応答形式が不正です');
    }

    return analysis;
  } catch (error) {
    console.error('OpenAI API エラー:', error);

    // エラーの種類に応じたメッセージ
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new Error('ちょっと混み合ってます。少し待ってからもう一度試してみてください。');
      } else if (error.status === 401) {
        throw new Error('API設定に問題があります。管理者に連絡してください。');
      }
    }

    throw new Error('分析中にエラーが発生しました。もう一度試してください。');
  }
}
