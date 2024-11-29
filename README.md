# 3D Portfolio Showcase - 3D空間ポートフォリオ

[English](README_en.md) | 日本語

3D空間を活用したポートフォリオショーケースサイトです。React、Three.js、TypeScriptを使用して構築され、インタラクティブな3D環境でプロジェクトを展示できます。認証機能とリアルタイム更新機能を備えています。

## 概要

このプロジェクトは、以下の特徴を持つ革新的なポートフォリオプラットフォームです：

- 3D空間でのプロジェクト展示
- インタラクティブな操作性
- モダンな技術スタックの活用
- セキュアな認証システム

## 機能

- 🎨 インタラクティブな3D空間でのプロジェクト展示
- 🔐 Supabaseを使用した安全な認証システム
- 📱 Tailwind CSSによるレスポンシブデザイン
- 🎯 TypeScriptによる型安全性の確保
- 🗄️ PostgreSQLデータベースとDrizzle ORMの活用
- 🔄 リアルタイム更新機能
- ⭐ プロジェクト評価とレビューシステム

## Features

- 🎨 Interactive 3D space for project showcasing
- 🔐 User authentication with Supabase
- 📱 Responsive design with Tailwind CSS
- 🎯 TypeScript for type safety
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔄 Real-time updates
- ⭐ Project rating and review system

## 技術スタック | Tech Stack

- **Frontend:**
  - React
  - Three.js / React Three Fiber
  - Tailwind CSS
  - TypeScript
  - Vite

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - Drizzle ORM
  - Supabase Auth

## 必要条件 | Prerequisites

開発を始める前に、以下の環境が必要です：

### 必須要件
- Node.js（バージョン18以上または20以上を推奨）
  ```bash
  node -v  # バージョン確認
  ```
- PostgreSQLデータベース（Replitでは自動設定）
  - ローカル開発の場合：PostgreSQL 14以上
- Supabaseアカウント（認証用）
  - [Supabase](https://supabase.com)でプロジェクトを作成
- npmまたはyarnパッケージマネージャー
  ```bash
  npm -v  # npmのバージョン確認
  ```

### 推奨要件
- Git（ローカル開発用、任意）
  ```bash
  git --version  # Gitのバージョン確認
  ```
- VSCode + 推奨拡張機能:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - Three.js Editor Tools

注意：Replitを使用する場合、これらの要件は自動的に設定されます。

## 開発環境のセットアップ | Development Environment

### Replitでの開発（推奨）

1. Replitでプロジェクトをフォーク
   - [Replitプロジェクトページ](https://replit.com/@username/project-name)にアクセス
   - 「Fork」ボタンをクリック

2. 環境変数の設定
   - Replitのツールバーから「Secrets」タブを開く
   - 以下の環境変数を設定：
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. 開発サーバーの起動
   - 「Run」ボタンをクリック
   - 自動的に以下が設定されます：
     - PostgreSQLデータベースの設定
     - 必要な依存関係のインストール
     - 開発サーバーの設定

4. アプリケーションの確認
   - Replitのプレビューウィンドウで自動的に表示
   - ホットリロードが有効な状態で開発可能

### ローカル開発環境のセットアップ | Local Development Setup

1. リポジトリのクローン:
```bash
git clone <repository-url>
cd portfolio-3d
```

2. 依存関係のインストール:
```bash
# npmの場合
npm install

# yarnの場合
yarn install

# グローバルな依存関係のインストール（必要な場合）
npm install -g typescript ts-node
```

3. 環境変数の設定:
   
`.env`ファイルをプロジェクトルートに作成:
```env
# データベース設定
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=portfolio_db

# Supabase設定（認証用）
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# サーバー設定
NODE_ENV=development  # または production
PORT=3000  # APIサーバーポート
```

4. データベースのセットアップ:
```bash
# PostgreSQLサービスが実行中であることを確認
sudo service postgresql status  # Linuxの場合
brew services list             # macOSの場合

# データベースの作成
createdb portfolio_db

# マイグレーションの実行
npm run db:push

# 初期データの投入（オプション）
npm run db:seed
```

5. 開発サーバーの起動:
```bash
# フロントエンドとバックエンドを同時に起動
npm run dev

# 個別に起動する場合
npm run dev:client  # フロントエンドのみ
npm run dev:server  # バックエンドのみ
```

The application will be available at:
- Frontend: http://localhost:5173
- API Server: http://localhost:3000

## Available Scripts

- `npm run dev` - Start the development environment (both client and server)
- `npm run dev:server` - Start only the API server with auto-reload
- `npm run dev:client` - Start only the client development server
- `npm run build` - Build the application for production (both client and server)
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to PostgreSQL

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── scenes/     # Three.js scene components
│   │   └── types/      # TypeScript type definitions
├── server/              # Backend Express application
│   ├── routes/         # API routes
│   ├── auth/           # Authentication logic
│   └── index.ts        # Server entry point
├── db/                  # Database configuration
│   ├── schema.ts       # Drizzle schema definitions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Database Schema

The application uses the following main tables:
- `users` - User profiles and authentication
- `projects` - Portfolio projects with 3D positioning
- `reviews` - Project reviews and ratings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Reviews
- `GET /api/projects/:id/reviews` - Get project reviews
- `POST /api/projects/:id/reviews` - Add a review

## トラブルシューティング | Troubleshooting

### データベース接続の問題
- PostgreSQLが実行中か確認:
  ```bash
  # Linuxの場合
  sudo service postgresql status
  # macOSの場合
  brew services list | grep postgresql
  ```
- DATABASE_URLの形式を確認:
  ```
  postgresql://username:password@localhost:5432/database_name
  ```
- データベースユーザーの権限確認:
  ```sql
  # PostgreSQLコンソールで実行
  \du  -- ユーザー権限の一覧表示
  ```

### 3D表示の問題
- ブラウザの設定:
  - ハードウェアアクセラレーションを有効化
  - WebGL対応を確認: `chrome://gpu`
- パフォーマンスの最適化:
  - ポリゴン数の削減
  - テクスチャサイズの最適化
  - モデルの最適化推奨設定:
    ```javascript
    // Three.jsの最適化設定例
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    ```

### 認証関連の問題
- Supabase認証情報の確認:
  1. Supabaseダッシュボードで認証情報を確認
  2. 環境変数の値が正しいか確認
- CORS関連のエラー:
  - ブラウザのコンソールでエラーを確認
  - バックエンドのCORS設定を確認:
    ```javascript
    // server/index.tsでのCORS設定例
    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    }));
    ```
- 環境変数のトラブルシューティング:
  ```bash
  # 環境変数が正しく設定されているか確認
  printenv | grep VITE_
  printenv | grep PG
  ```

## License

MIT License - see LICENSE file for details

## Deployment

The recommended deployment platform for this project is Replit:

1. Fork the project on Replit
2. Set up the required environment variables in Replit Secrets
3. Use the "Run" button to deploy
4. Replit will automatically:
   - Set up the database
   - Install dependencies
   - Build and serve the application
   - Provide a public URL for your portfolio

For the best performance, consider upgrading to a paid Replit plan for additional resources and always-on deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of changes

## Support

For support, please open an issue on the repository or contact the maintainers.
