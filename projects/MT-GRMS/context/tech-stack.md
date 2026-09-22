---
title: Tech Stack
description: Ngăn xếp công nghệ sử dụng trong dự án MT-GRMS.
---

# 🛠 Tech Stack dự án MT-GRMS

Dự án MT-GRMS được xây dựng trên nền tảng Web-based Application (SaaS) kết hợp cùng kiến trúc Multi-Tenant phân lập dữ liệu.

## Frontend
- **Framework/Thư viện**: ReactJS
- **Build tool**: Vite
- **UI/Components**: HTML, CSS, JavaScript (tùy chọn thư viện components nội bộ nhóm)
- **Unit Testing**: Karma / Jasmine

## Backend
- **Framework**: .NET Core (ASP.NET Core Web API)
- **Ngôn ngữ**: C#
- **ORM**: Entity Framework Core (EF Core)
- **Kiến trúc**: Phân lớp Services, áp dụng Multi-Tenant Global Query Filter
- **Unit/Integration Testing**: xUnit / NUnit, Moq, WebApplicationFactory

## Database & Caching
- **Database chính**: SQL Server
- **Caching**: Redis Cache (dùng cho AI Recommender với Timeout 3s)

## AI & Third-Party APIs (External Interfaces)
- **AI Recommender LLM**: Google Gemini API (để trích xuất ý định khách hàng)
- **Payment Gateway**: VietQR (tạo mã QR động & Webhook)
- **Shipping**: Tích hợp GHN Shipping API
- **Email Gateway**: SMTP / SendGrid (Gửi OTP, mật khẩu)

## Infrastructure & DevOps
- **Source Control**: GitHub (với Git Flow: main, develop, feature, hotfix)
- **CI/CD**: Tích hợp GitHub Actions (nếu có)
- **Deployment**: VPS Web Server / AWS

## Hardware / External Devices (Non-Functional Requirements)
- **Mã vạch**: Chuẩn USB HID cho máy quét Barcode.
- **In hóa đơn**: Chuẩn tập lệnh ESC-POS (khổ 80mm/58mm) cho máy in nhiệt.
