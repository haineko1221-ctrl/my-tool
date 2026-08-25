# 🍚 まいにちごはん

高齢者向けの食事記録・AI分析システム。料理の写真を送るだけで、AIが食事内容を分析し、温かいコメントと明日の提案を返します。

## コンセプト

「食べる＝生きる」

食事を楽しみ、続けたくなる仕組みで、毎日の食事を気にかけるきっかけを作ります。

## 主な機能

- 📸 **写真アップロード**: カメラまたはファイルから食事の写真を選択
- 🤖 **AI分析**: OpenAI GPT-4oによる画像認識と栄養バランス分析
- 💬 **温かいコメント**: 関西弁のニュアンスで前向きなフィードバック
- 📊 **バランス表示**: 野菜・タンパク質・主食のバランスを分かりやすく表示
- 📅 **履歴機能**: 過去の記録と連続記録の管理
- 📱 **高齢者向けUI**: 大きなボタン（最小64px）、大きな文字（最小18px）、高コントラスト

## 技術スタック

- **フロントエンド**: Next.js 16.3.2 (App Router) + TypeScript
- **スタイリング**: TailwindCSS 4.0
- **AI**: OpenAI GPT-4o (Vision API)
- **データ保存**: LocalStorage（Phase 1 MVP）
- **ホスティング**: Vercel

## セットアップ

### 1. 環境変数の設定

`.env.local` ファイルを作成し、OpenAI APIキーを設定:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### モバイルデバイスでのテスト

同じWi-Fiネットワーク上のスマートフォンからアクセスする場合:

```
http://192.168.x.x:3000
```

（`192.168.x.x`は開発サーバーが表示するIPアドレス）

## デプロイ

### Vercelへのデプロイ

1. GitHubにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数に `OPENAI_API_KEY` を設定
4. デプロイ

## プロジェクト構成

```
mainichi-gohan/
├── app/
│   ├── page.tsx                # ホーム画面
│   ├── upload/page.tsx         # 画像アップロード
│   ├── result/page.tsx         # 分析結果表示
│   ├── history/page.tsx        # 履歴一覧
│   └── api/analyze/route.ts    # OpenAI API呼び出し
├── components/
│   ├── Button.tsx              # 高齢者向けボタン
│   ├── ImageUploader.tsx       # 画像アップローダー
│   ├── Loading.tsx             # ローディング画面
│   └── HistoryItem.tsx         # 履歴アイテム
├── lib/
│   ├── openai.ts              # OpenAI API統合
│   ├── storage.ts             # LocalStorage管理
│   └── utils.ts               # 画像最適化など
└── types/
    └── meal.ts                # 型定義

```

## 今後の予定（Phase 2）

- Firebase Authentication（Google/メールログイン）
- Cloud Firestore（クラウドデータ保存）
- Firebase Storage（画像のクラウド保存）
- 週間まとめ機能
- 家族共有機能
- LINE連携
