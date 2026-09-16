# Team AI Knowledge Base

> Shared Knowledge Base for AI Agents & Developers — Lưu trữ và đồng bộ ngữ cảnh AI cho toàn team.

## 📋 Tổng quan

Hệ thống Knowledge Base dùng chung giữa các AI tools (Cursor, Claude Code, Windsurf, Copilot) và developers, giúp:

- **Chia sẻ context** xuyên suốt giữa các AI agents
- **Lưu trữ patterns, decisions, lessons** của team
- **Theo dõi session** để không mất ngữ cảnh giữa các phiên làm việc

## 🏗️ Cấu trúc dự án

```
team-ai-knowledge/
├── _global/              # Knowledge áp dụng cho TẤT CẢ projects
│   ├── patterns/         # Coding conventions & patterns
│   ├── decisions/        # Architecture Decision Records (ADR)
│   └── lessons/          # Bài học từ bugs & issues
├── projects/             # Knowledge riêng từng project
├── mcp-server/           # MCP Server (TypeScript) — giao tiếp AI agents
│   ├── src/              # Source code
│   └── dist/             # Build output (gitignored)
├── scripts/              # Utility scripts (validate, build-index, ...)
├── docs/                 # Documentation & dashboard
├── .schema/              # JSON schemas cho frontmatter validation
├── AGENTS.md             # Quy trình bắt buộc cho AI agents
├── CLAUDE.md             # Claude Code specific config
├── START_HERE.md         # Bản đồ điều hướng KB
├── KNOWLEDGE_MAP.md      # Bản đồ tri thức
└── .mcp.json.template    # Template cấu hình MCP (copy → .mcp.json)
```

## 🚀 Cài đặt

### 1. Clone repo

```bash
git clone <repo-url>
cd team-ai-knowledge
```

### 2. Cài dependencies

```bash
# Root dependencies (validation, indexing scripts)
npm install

# MCP Server dependencies
cd mcp-server
npm install
npm run build
cd ..
```

### 3. Cấu hình MCP

Copy template và thay đường dẫn thực tế:

```bash
cp .mcp.json.template .mcp.json
```

Mở `.mcp.json` và thay `<YOUR_KB_PATH>` bằng đường dẫn tuyệt đối tới thư mục này.

### 4. Setup Git hooks (optional)

```bash
npm run setup:hooks
```

## 🛠️ Scripts

| Script | Mô tả |
|--------|--------|
| `npm run validate` | Validate frontmatter của tất cả file trong KB |
| `npm run build:index` | Build search index (`.index/search-index.json`) |
| `npm run stale` | Kiểm tra file lỗi thời |
| `npm run setup:hooks` | Cài đặt Git hooks tự động |

## 📖 Hướng dẫn sử dụng

Xem [START_HERE.md](./START_HERE.md) để bắt đầu.

## 📄 License

Private — Internal use only.
