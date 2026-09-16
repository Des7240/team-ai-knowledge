# KNOWLEDGE_MAP.md — Bản đồ Knowledge Base

> Dùng file này để hiểu toàn bộ cấu trúc KB và quan hệ giữa các docs.

---

## Cấu trúc tổng quan

```
team-ai-knowledge/
│
├── _global/                    ← Áp dụng cho TẤT CẢ projects
│   ├── patterns/               ← Coding conventions
│   ├── decisions/              ← Quyết định cấp team
│   └── lessons/                ← Bài học chung
│
└── projects/                   ← Riêng từng project
    └── {project-name}/
        ├── context/            ← Thông tin nền dự án
        ├── decisions/          ← ADR riêng project
        ├── lessons/            ← Lessons riêng project
        ├── sessions/           ← Lịch sử phiên làm việc
        └── archive/            ← Docs đã superseded
```

---

## Global Patterns

| File | Scope | Mô tả ngắn |
|------|-------|------------|
| [error-handling.md](./_global/patterns/error-handling.md) | cross-cutting | Result pattern, không throw |
| [api-response.md](./_global/patterns/api-response.md) | backend | Format chuẩn response API |
| [naming-conventions.md](./_global/patterns/naming-conventions.md) | cross-cutting | Quy ước đặt tên |
| [git-workflow.md](./_global/patterns/git-workflow.md) | devops | Branch, commit, PR |

---

## Global Decisions

| ID | Status | Scope | Title |
|----|--------|-------|-------|
| [ADR-0001](./_global/decisions/ADR-0001-knowledge-base-structure.md) | accepted | cross-cutting | Cấu trúc Knowledge Base dùng chung |

---

## Projects

| Project | Status | Mô tả |
|---------|--------|-------|
| [example-project](./projects/example-project/) | template | Template — copy để tạo project mới |

---

## Cách đọc KB theo từng tình huống

### Tôi là dev mới, cần hiểu tổng quan
1. Đọc file này
2. Đọc `_global/patterns/` — biết team code kiểu gì
3. Đọc `projects/{project-của-tôi}/context/project-overview.md`
4. Đọc `projects/{project-của-tôi}/context/tech-stack.md`

### Tôi cần biết team đã quyết định gì về X
1. Tìm trong `_global/decisions/` — quyết định cấp team
2. Tìm trong `projects/{project}/decisions/` — quyết định riêng project

### Tôi đang gặp bug, muốn biết team đã gặp chưa
1. Tìm trong `projects/{project}/lessons/` — lessons riêng project
2. Tìm trong `_global/lessons/` — lessons chung

### Tôi muốn biết team đã làm gì tuần qua
1. Xem `projects/{project}/sessions/` — sắp xếp theo ngày
