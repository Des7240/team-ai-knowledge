---
changelog:
  - date: '2026-10-12T15:12:07.585Z'
    author: Tech Lead
    reason: Khởi tạo dự án ai-team-kit trong Knowledge Base
    impact: Tạo tài liệu tổng quan ngữ cảnh dự án ai-team-kit trên remote MCP
---
# 🚀 AI Team Kit — Bộ Công Cụ Điều Phối AI Trung Tâm

**Tên dự án:** AI Team Kit (Central Governance Hub)  
**Nhóm thực hiện:** SEP490-G84 (FPT University, Fall 2026)  
**Mã nguồn:** SEP490-G84-MTGRMS/ai-team-kit  

---

## 1. Bối cảnh & Vai trò Cốt lõi (Central Brain Architecture)

Trong các dự án phát triển phần mềm đa nền tảng có nhiều thành viên và nhiều repository độc lập (`MT_GRMS_BACKEND`, `MT_GRMS_FRONTEND`, `DOCS_MT_GRMS`):
- Các AI Agent (Cursor, Claude Code, Antigravity) thường chỉ nhìn thấy phạm vi cục bộ của repo đang mở, dẫn đến:
  - Đoán mò cấu trúc Database Schema, làm lệch kiểu dữ liệu hoặc vi phạm quan hệ khóa ngoại.
  - Vi phạm quy ước kiến trúc (Clean Architecture 4 tầng, UI Design System Electric Blue).
  - Thiếu đồng bộ Git giữa các thành viên, quên đẩy Spec/Tasks lên remote khiến Admin và đồng đội không nắm được tiến độ.

**AI Team Kit** đóng vai trò là **"Bộ Não Điều Phối Trung Tâm" (Central Governance Hub)**:
- Quản lý tập trung toàn bộ Knowledge Base, Architecture Decisions (ADR), Coding Patterns, Lessons Learned và Database Schema.
- Cung cấp MCP Server `sep` và `team-knowledge-base` kết nối trực tiếp vào IDE của toàn bộ thành viên.
- Thực thi quy trình phát triển tính năng chuẩn mực 6 bước thông qua nhạc trưởng Auto-Pilot (`/sep-pilot`) và cơ chế phỏng vấn phản biện (Grill-Me).

---

## 2. Các Phân Hệ & Chức Năng Chính

1. **Central Knowledge Base & Design Hub**:
   - Quản lý Từ điển Dữ liệu (Data Dictionary), Mermaid ERD và nguyên tắc kiến trúc bất biến.
   - Cung cấp các công cụ MCP tra cứu nhanh: `xem_thiet_ke`, `xem_mau_thiet_ke`, `xem_quyet_dinh`, `xem_bai_hoc`.
2. **Quy trình Phát triển Tính năng SEP 6 bước**:
   - `/sep-spec`: Xác định mục tiêu, phạm vi và schema (`feature`, `bug-fix`, `refactor`).
   - `/sep-brainstorm`: Khảo sát phương án kỹ thuật, thiết kế UI/API, đặc tả delta specs.
   - `/sep-verify-spec`: Phản biện đa persona (Skeptic, Guardian, Advocate, Codebase) và lập checklist tasks.
   - `/sep-apply`: Thực thi mã nguồn theo task, tự động đồng bộ C# Entity Backend sang tài liệu thiết kế (`db-sync`).
   - `/sep-test`: Kiểm thử nghiệm thu đạt `verdict: PASS`.
   - `/sep-archive`: Đóng change, tự động merge delta specs vào tài liệu đặc tả gốc của hệ thống.
3. **Bộ Điều Phối Thông Minh & Cơ Chế Kiểm Soát An Toàn**:
   - `/sep-pilot`: Tự động nhận diện tiến độ và phỏng vấn tương tác (grill-me) qua từng bước.
   - `/sep-back`: Lùi bước an toàn, bảo toàn 100% artifact và reset cổng duyệt.
   - **2 Checkpoints Bắt Buộc**: Tự động Force-Push lên GitHub tại Chốt 1 (khi chốt spec) và Chốt 2 (khi nghiệm thu archive).

---

## 3. Các Kho Chứa Liên Kết (Connected Repositories)

| Repo | Vai trò | Công nghệ |
|---|---|---|
| `ai-team-kit` | Bộ não điều phối trung tâm | Node.js 22, TypeScript, MCP SDK, Express, gray-matter |
| `MT_GRMS_BACKEND` | Backend nghiệp vụ | .NET 8, ASP.NET Core Web API, Clean Architecture, EF Core 8 |
| `MT_GRMS_FRONTEND` | Frontend giao diện | React 19, TypeScript, Vite, Ant Design v6, Tailwind CSS v4 |
| `DOCS_MT_GRMS` | Tài liệu quản lý đồ án & PM | SRS, Software Architecture Document, Project Tracking |
