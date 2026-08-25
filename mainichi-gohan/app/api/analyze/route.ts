import { NextRequest, NextResponse } from 'next/server';
import { analyzeMealImage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageDataUrl } = body;

    // 入力チェック
    if (!imageDataUrl) {
      return NextResponse.json(
        { error: '画像データがありません' },
        { status: 400 }
      );
    }

    // Base64形式かチェック
    if (!imageDataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: '不正な画像形式です' },
        { status: 400 }
      );
    }

    console.log('画像分析開始...');

    // OpenAI Vision APIで分析
    const analysis = await analyzeMealImage(imageDataUrl);

    console.log('画像分析完了:', analysis);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('API エラー:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : '分析中にエラーが発生しました';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
