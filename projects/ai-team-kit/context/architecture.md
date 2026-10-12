---
changelog:
  - date: '2026-10-12T15:12:52.816Z'
    author: Tech Lead
    reason: Khởi tạo tài liệu kiến trúc cho dự án ai-team-kit
    impact: Tạo tài liệu kiến trúc architecture.md cho ai-team-kit trên remote MCP
---
# 🏛️ Kiến Trúc Hệ Thống & Luồng Điều Phối (Architecture Overview) — AI Team Kit

**Dự án:** AI Team Kit  
**Cập nhật lần cuối:** 2026-10-12  

---

## 1. Mô Hình Điều Phối Trung Tâm (Central Brain Pattern)

```mermaid
graph TD
    subgraph CENTRAL_HUB ["🧠 Central Brain (team-ai-knowledge)"]
        KB["📚 Knowledge Base<br/>(Patterns, ADRs, Lessons)"]
        Design["📐 Design Hub<br/>(database-schema.md, ERD)"]
        MCP["⚙️ MCP Server 'sep'<br/>(26 Tools)"]
        OpenSpec["📋 OpenSpec Engine<br/>(Changes, Specs, Tasks)"]
    end

    subgraph REPOS ["🏢 Vệ Tinh Thực Thi (Satellite Repos)"]
        BE["⚙️ MT_GRMS_BACKEND<br/>(Clean Architecture, EF Core)"]
        FE["🎨 MT_GRMS_FRONTEND<br/>(React 19, TypeScript, Antd)"]
        DOCS["👔 DOCS_MT_GRMS<br/>(PM, SAD, SRS)"]
    end

    MCP -->|Bơm Rules, Prompts & Context| BE
    MCP -->|Bơm Rules, Prompts & Context| FE
    BE -->|Quét C# Entity tự động (db-sync)| Design
    Design -->|Tra cứu bảng/cột tức thì (xem_thiet_ke)| FE
    OpenSpec -->|Quản lý Tasks & Test Verdict| BE
    OpenSpec -->|Quản lý Tasks & Test Verdict| FE
```

---

## 2. Quy Trình Điều Phối Thông Minh (Smart Orchestrator)

Hệ thống cung cấp lệnh tổng `/sep-pilot` đóng vai trò nhạc trưởng:
1. **Auto-Pilot**: Tự động xác định bước kế tiếp của OpenSpec Change, dẫn dắt AI Agent thực hiện công việc.
2. **Grill-Me Mode**: Dừng lại ở các chốt then chốt (Brainstorm, Verify-Spec, Gate duyệt) để phỏng vấn lập trình viên, giải quyết triệt để các phân vân về thiết kế trước khi chuyển bước.
3. **Safe Rollback (`/sep-back`)**: Cho phép lùi bước linh hoạt mà không làm mất file code hoặc artifact đã làm, đồng thời reset cổng duyệt để đảm bảo an toàn.

---

## 3. Cơ Chế 2 Chốt Kiểm Soát Bắt Buộc (2 Force-Push Checkpoints)

1. **Chốt 1 — Sau khi Duyệt Spec (`/sep-verify-spec` Approve)**:
   - Hệ thống tự động commit và **Force-Push ngay lên GitHub** bộ `specs.md` delta, `tasks.md` và các bản review của persona. Toàn bộ team lập tức nắm được phạm vi công việc.
2. **Chốt 2 — Sau khi Nghiệm Thu Hoàn Tất (`/sep-archive` Archived)**:
   - Hệ thống tự động merge delta specs vào spec gốc của hệ thống và **Force-Push toàn bộ tài liệu nghiệm thu** lên remote để Admin/PM tiến hành merge PR an toàn.
