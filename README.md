# Avatar - Faster Whisper

音声対話アバターシステム。ASR / LLM / TTS / リップシンクを組み合わせ、VRM アバターとリアルタイムに会話できる。

## 技術スタック

- **ランタイム:** Bun
- **API:** Hono (TypeScript)
- **ASR:** faster-whisper (CPU)
- **LLM:** DeepSeek V3 / R1 (API)
- **TTS:** VOICEVOX (CPU)
- **リップシンク:** Viseme マッピング
- **アバター:** Three.js + VRM
- **DB:** PostgreSQL + Redis
- **フロントエンド:** React + Vite

## セットアップ

```bash
# 依存インストール
bun install

# Docker イメージ取得 + VRM モデルダウンロード
just setup
```

## 起動

```bash
just dev
```

Docker Compose + API + フロントエンドが一括で立ち上がる。

## ポート一覧

| サービス | ポート |
|---------|-------|
| API (Bun + Hono) | 3847 |
| faster-whisper | 8847 |
| VOICEVOX | 50847 |
| PostgreSQL | 5847 |
| Redis | 6847 |
| Vite (フロントエンド) | 5847 |

## 環境変数 (.env)

| 変数 | 説明 |
|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API キー |
| `WHISPER_URL` | faster-whisper エンドポイント (default: `http://localhost:8847`) |
| `VOICEVOX_URL` | VOICEVOX エンドポイント (default: `http://localhost:50847`) |

## プロジェクト構成

```
.
├── api/          # バックエンド (Bun + Hono)
├── web/          # フロントエンド (React + Vite + Three.js)
├── docker-compose.yml
├── justfile
└── .env
```
