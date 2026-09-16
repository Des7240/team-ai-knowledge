# AGENTS.md — Quy trình bắt buộc cho AI Agents

> File này được nạp tự động vào context của AI agent khi bắt đầu phiên.
> Mọi AI tool trong team đều phải tuân thủ các quy trình dưới đây.

---

## 🔌 Kết nối MCP Knowledge Base

Bạn đang được kết nối với **Team Knowledge Base** qua MCP.
Bạn có quyền truy cập các tools sau:

| Tool | Mục đích |
|------|---------|
| `get_overview()` | Lấy START_HERE.md — bản đồ KB |
| `get_context(name)` | Lấy tài liệu context của project |
| `get_decision(id?, scope?)` | Lấy Architecture Decision Record |
| `get_pattern(name)` | Lấy coding pattern/convention |
| `list_recent(days?, limit?)` | Hoạt động team gần đây |
| `search_knowledge(query, ...)` | Tìm kiếm toàn bộ KB |
| `find_lessons(symptom, scope?)` | Tìm bài học liên quan đến bug/lỗi |
| `save_session(...)` | Ghi tóm tắt phiên làm việc |
| `save_lesson(...)` | Ghi bài học mới |

---

## 📋 QUY TRÌNH 1: Bắt đầu phiên làm việc

**Thực hiện NGAY KHI bắt đầu**, trước bất kỳ việc gì khác:

```
Bước 1: Gọi get_overview()
        → Đọc START_HERE.md để nắm cấu trúc KB

Bước 2: Gọi list_recent(days=3)
        → Biết team vừa làm gì trong 3 ngày qua
        → Tóm tắt cho user: "Gần đây Dev X đã làm..."
```

**Không bao giờ bắt đầu làm task mà không thực hiện 2 bước trên.**

---

## 📋 QUY TRÌNH 2: Trong khi làm việc

### Trước khi viết code mới
```
→ Gọi get_pattern("tên-chức-năng")
→ Viết code theo đúng pattern của team
→ KHÔNG được dùng style riêng của AI nếu team đã có convention
```

### Trước khi đề xuất thay đổi kiến trúc
```
→ Gọi get_decision(scope="phạm-vi-liên-quan")
→ Kiểm tra team đã có quyết định liên quan chưa
→ Nếu muốn thay đổi quyết định cũ, thông báo rõ cho user
   và đề xuất tạo ADR mới
```

### Khi gặp bug / lỗi khó
```
→ Gọi find_lessons("mô tả lỗi/symptom")
→ TRƯỚC KHI tự debug, kiểm tra KB có lesson liên quan không
→ Nếu tìm thấy: áp dụng giải pháp đã được ghi nhận
→ Nếu không có: debug bình thường, SAU ĐÓ gợi ý lưu lesson
```

### Khi cần thông tin chung về project
```
→ Gọi get_context("tên-doc")
   Ví dụ: get_context("tech-stack"), get_context("database-schema")
→ Không tự đoán stack/architecture nếu chưa đọc context docs
```

---

## 📋 QUY TRÌNH 3: Kết thúc phiên làm việc (QUAN TRỌNG NHẤT)

**Kích hoạt khi user nói:** "tổng kết", "summarize", "xong rồi",
"kết thúc phiên", "save session", hoặc tương tự.

### Bước 1: Tạo draft summary
Phân tích toàn bộ cuộc hội thoại trong phiên và tạo draft với cấu trúc:

```
📋 DRAFT SESSION SUMMARY

Title: [Tiêu đề ngắn gọn cho phiên]

Objective: [Mục tiêu ban đầu của phiên]

What Changed:
- [file/module]: [mô tả thay đổi]
- ...

Key Decisions:
- [Quyết định 1 — lý do ngắn gọn]
- ...

Issues Encountered:
- [Vấn đề gặp phải — cách giải quyết]
- ...

Follow-up Tasks:
- [ ] [Task chưa hoàn thành]
- ...
```

### Bước 2: Trình bày cho user review
- Hỏi user: "Bạn có muốn sửa gì không?"
- Chờ user phản hồi, chỉnh sửa nếu cần

### Bước 3: Lưu khi user đồng ý
```
→ Gọi save_session({
    title, author, tool, objective,
    changes, decisions, issues, followUp, tags
  })
```

### Bước 4: Đề xuất lưu lesson nếu có bug đáng ghi nhớ
```
Nếu trong phiên có bug/issue khó:
→ Hỏi: "Phiên này có [tên bug], bạn muốn lưu thành lesson không?"
→ Nếu user đồng ý: gọi save_lesson(...)
```

---

## ⚠️ Nguyên tắc tuyệt đối

1. **KHÔNG** tự xoá hoặc ghi đè file trong KB
2. **KHÔNG** bỏ qua việc lưu session khi user kết thúc phiên
3. **KHÔNG** đề xuất giải pháp trái ngược ADR đã accepted mà không thông báo
4. **LUÔN** kiểm tra KB trước khi debug — đừng lặp lại lỗi team đã biết
5. **LUÔN** validate content trước khi gọi save — đảm bảo đủ thông tin

---

## 🗂️ Token Loading Strategy

Để tiết kiệm token, tải context theo thứ tự sau:

```
Tầng 1 (luôn tải):    get_overview + list_recent       ~600 tokens
Tầng 2 (khi cần):     get_pattern / get_decision        ~400 tokens/doc
Tầng 3 (chi tiết):    full content của doc cụ thể       ~800 tokens/doc
```

**Không bao giờ tải toàn bộ KB** — chỉ tải những gì task yêu cầu.
