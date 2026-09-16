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

## 🚀 Chế độ hoạt động (Dual-Mode)

MCP Server hỗ trợ 2 chế độ, tự động nhận diện thông qua Environment Variables:

1. **Stdio Mode (Local)**: Dành cho phát triển. Server chạy dưới dạng local process, đọc/ghi trực tiếp vào filesystem.
2. **HTTP Mode (Remote)**: Dành cho deploy (ví dụ: Render). Server chạy HTTP endpoint, đọc/ghi qua GitHub Contents API. Kích hoạt khi có biến môi trường `GITHUB_TOKEN`.

### Hướng dẫn Deploy (HTTP Mode - Render)

1. Tạo một Web Service trên Render.
2. Set Build Command: `cd mcp-server && npm install && npm run build`
3. Set Start Command: `cd mcp-server && node dist/index.js`
4. Cấu hình Environment Variables:
   - `GITHUB_TOKEN`: Fine-grained token có quyền đọc/ghi repo (Contents: Read & Write).
   - `GITHUB_OWNER`: Tên tài khoản hoặc tổ chức chứa repo (vd: `your-username`).
   - `GITHUB_REPO`: Tên repo (vd: `team-ai-knowledge`).

### Cấu hình Client (.mcp.json)

Copy template và thay thế tuỳ nhu cầu:

```bash
cp .mcp.json.template .mcp.json
```

Trong IDE (Cursor/Windsurf), bạn có thể cấu hình trỏ tới Local (stdio) hoặc Remote (HTTP):

```json
{
  "mcpServers": {
    "team-knowledge-base-local": {
      "command": "node",
      "args": ["<YOUR_KB_PATH>/mcp-server/dist/index.js"],
      "env": { "KB_ROOT": "<YOUR_KB_PATH>" }
    },
    "team-knowledge-base-remote": {
      "type": "streamable-http",
      "serverURL": "https://<YOUR_RENDER_URL>/mcp"
    }
  }
}
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
