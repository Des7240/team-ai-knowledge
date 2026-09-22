# 🚀 Team AI Knowledge Base — Điểm Xuất Phát

> **Dành cho AI Agents:** Đọc file này TRƯỚC KHI làm bất kỳ việc gì.  
> **Dành cho Dev:** Đây là bản đồ điều hướng toàn bộ knowledge base của team.

---

## Bạn đang ở đây

```
team-ai-knowledge/
├── _global/          ← Knowledge áp dụng cho TẤT CẢ projects
└── projects/         ← Knowledge riêng từng project
    ├── project-alpha/
    ├── project-beta/
    └── ...
```

---

## 📌 Cho AI Agents: Đọc ngay những thứ này

### Bước 1 — Luôn làm đầu tiên
Gọi tool `list_recent(days=3)` để biết team vừa làm gì gần đây.

### Bước 2 — Tuỳ theo task
| Task của bạn | Tra cứu ở đâu |
|---|---|
| Viết code mới | `get_pattern("tên-pattern")` |
| Thay đổi kiến trúc | `get_decision(scope="...")` |
| Debug bug | `find_lessons("mô tả lỗi")` |
| Cần hiểu project | `get_context("tên-doc")` |
| Tìm kiếm chung | `search_knowledge("từ khoá")` |

### Bước 3 — Cuối phiên (BẮT BUỘC)
Khi user nói "tổng kết", "summarize", hoặc kết thúc → Gọi `save_session(...)`.

> Xem `AGENTS.md` để biết đầy đủ quy trình.

---

## 🗂️ Điều hướng nhanh

### Global Knowledge (áp dụng mọi project)

| Loại | Đường dẫn | Mô tả |
|------|-----------|-------|
| **Patterns** | [`_global/patterns/`](./_global/patterns/) | Coding conventions của team |
| **Decisions** | [`_global/decisions/`](./_global/decisions/) | Quyết định cấp team |
| **Lessons** | [`_global/lessons/`](./_global/lessons/) | Bài học chung |

### Projects

| Project | Đường dẫn | Mô tả |
|---------|-----------|-------|
| team-ai-knowledge | [`projects/team-ai-knowledge/`](./projects/team-ai-knowledge/) | Knowledge về bản thân hệ thống KB |
| MT-GRMS | [`projects/MT-GRMS/`](./projects/MT-GRMS/) | Hệ thống quản lý bán lẻ tạp hóa đa khách hàng |

> Thêm project mới vào đây sau khi tạo.

---

## 📋 Patterns hay dùng nhất

- [Error Handling](./_global/patterns/error-handling.md) — Cách xử lý lỗi của team
- [API Response Format](./_global/patterns/api-response.md) — Chuẩn response API
- [Naming Conventions](./_global/patterns/naming-conventions.md) — Quy ước đặt tên
- [Git Workflow](./_global/patterns/git-workflow.md) — Quy trình git của team

---

## 📖 Decisions quan trọng nhất

- [ADR-0001: Cấu trúc Knowledge Base](./_global/decisions/ADR-0001-knowledge-base-structure.md)

---

## ⚠️ Quy tắc vàng

1. **Không xoá file** — Chỉ chuyển vào `archive/` và đánh dấu superseded
2. **Không sửa ADR cũ** — Tạo ADR mới thay thế và link qua lại
3. **Luôn có frontmatter** — Mọi file phải có YAML frontmatter đúng schema
4. **Commit KB cùng code** — Thay đổi code → commit KB trong cùng session

---

*Cập nhật lần cuối: 2026-09-14 | Maintainer: Team Lead*
