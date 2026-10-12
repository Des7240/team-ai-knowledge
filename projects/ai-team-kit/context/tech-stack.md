---
changelog:
  - date: '2026-10-12T15:12:28.189Z'
    author: Tech Lead
    reason: Khởi tạo đặc tả công nghệ cho ai-team-kit
    impact: >-
      Tạo tài liệu ngăn xếp công nghệ tech-stack.md cho ai-team-kit trên remote
      MCP
---
# 🛠️ Ngăn Xếp Công Nghệ (Technology Stack) — AI Team Kit

**Dự án:** AI Team Kit  
**Cập nhật lần cuối:** 2026-10-12  

---

## 1. Nền Tảng & Runtime
- **Node.js**: v20+ / v22 LTS (ES Modules `type: "module"`).
- **TypeScript**: v5.7+ (Strict Mode, ES2022 target, NodeNext module resolution).
- **Package Manager**: npm v10+.

---

## 2. Kiến Trúc MCP (Model Context Protocol)
- **SDK**: `@modelcontextprotocol/sdk` v1.30+.
- **Dual-Mode Transport**:
  1. **Stdio Mode (Local Development)**:
     - Giao tiếp qua `process.stdin` / `process.stdout` (`StdioServerTransport`).
     - Tích hợp trực tiếp với IDE cá nhân của lập trình viên (Cursor, Claude Code, Antigravity).
     - Kết nối Git local repository, tự động commit và force-push tại các chốt an toàn.
  2. **HTTP Mode (Remote / Team Hub)**:
     - Giao tiếp qua Streamable HTTP / Server-Sent Events (SSE) (`StreamableHTTPServerTransport`).
     - Web framework: `express` v5.1+.
     - Xác thực bảo mật: Token-based Bearer Authentication (`MCP_AUTH_TOKENS`), ánh xạ Token sang GitHub username.
     - Triển khai trên Render / Cloud Server cho phép toàn team kết nối qua URL tập trung.

---

## 3. Quản Lý Dữ Liệu & Tài Liệu
- **gray-matter**: Phân tích YAML Frontmatter trong Markdown.
- **Zod**: Xác thực Schema cho đầu vào của MCP Tools (`zod` v3.24+).
- **js-yaml**: Đọc và ghi định dạng cấu hình OpenSpec YAML.
- **Git CLI Core**: Tương tác trực tiếp với Git Engine (`git pull --rebase --autostash`, `git commit`, `git push`, lock queue).

---

## 4. Tích Hợp Đa Nền Tảng (Cross-IDE Support)
- **Cursor**:
  - Skills: `~/.cursor/skills/`
  - Sub-Agents / Personas: `~/.cursor/agents/`
  - MCP Config: `~/.cursor/mcp.json`
  - Rules: `.cursor/rules/sep-kit-*.mdc`
- **Google Antigravity**:
  - Skills: `~/.gemini/config/skills/`
  - MCP Config: `~/.gemini/config/mcp_config.json`
  - Rules: `~/.gemini/config/rules/sep-kit-*.md`
- **Claude Code**:
  - Skills: `~/.claude/skills/`
  - MCP Config: `claude mcp add` (User Scope)
  - Rules: `~/.claude/CLAUDE.md`
