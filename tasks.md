## ローカル開発構成

```
ローカルPC 1台（Mac or Windows/Linux）
├── Bun + Hono（バックエンド）          ポート 3847
├── faster-whisper small（CPU）         ポート 8847
├── VOICEVOX（CPU）                    ポート 50847
├── DeepSeek API（外部、API呼び出しのみ）
├── Visemeマッピング（ロジックのみ、別プロセス不要）
├── プリレンダー映像合成 or Three.js+VRM
├── PostgreSQL                         ポート 5847
├── Redis                              ポート 6847
└── ブラウザで確認
```

## 最小構成の技術スタック（確定版）

- **ランタイム:** Bun
- **フレームワーク:** Hono (TypeScript)
- **ASR:** faster-whisper small/medium (CPU)
- **LLM:** DeepSeek V3 / R1 (API)
- **TTS:** VOICEVOX (CPU、ローカル起動)
- **リップシンク:** Visemeマッピング（自前ロジック）
- **ジェスチャー:** LLMタグ駆動 + プリセットアニメーション
- **アバター表示:** Phase 1はThree.js + VRM（ブラウザ確認可）、Phase 2でプリレンダー映像合成 or UE5
- **DB:** PostgreSQL + Redis
- **コンテナ:** Docker Compose で一発起動
- **フロントエンド:** ブラウザで確認はReactなどで確認

## Docker Compose構成

```yaml
services:
  api:
    build: ./api
    ports: ["3847:3847"]
    depends_on: [db, redis, voicevox, whisper]

  whisper:
    image: fedirz/faster-whisper-server
    ports: ["8847:8000"]
    environment:
      - WHISPER__MODEL=small
      - WHISPER__DEVICE=cpu

  voicevox:
    image: voicevox/voicevox_engine
    ports: ["50847:50021"]

  db:
    image: postgres:16
    ports: ["5847:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6847:6379"]

volumes:
  pgdata:
```

`docker compose up` で ASR・TTS・DB・Redis が全部立ち上がり、`bun dev` でAPIサーバーを起動すればローカルで完結します。

## Phase 1のアバター表示

ローカル開発ではまずブラウザで確認できる **Three.js + VRM** が最も手軽です。フォトリアルは後のフェーズで。

```
Phase 1: VRMアバター（ブラウザ）→ 対話パイプライン全体の動作確認
Phase 2: フォトリアル化（プリレンダー or UE5）
```

