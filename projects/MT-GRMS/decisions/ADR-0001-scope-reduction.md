---
id: ADR-0001
title: Loại bỏ Native Mobile App khỏi phạm vi v1
status: accepted
date: 2026-09-12
---

# ADR-0001: Tập trung phát triển Web App, loại bỏ Native Mobile App khỏi phạm vi Version 1

## Bối cảnh (Context)
Trong buổi họp báo cáo ý tưởng dự án (Meeting_Minutes_Week1, MOM-01), nhóm đề xuất 26 tính năng rất lớn cho hệ thống MT-GRMS (Multi-Tenant Grocery Retail Management System). Giảng viên hướng dẫn (Mentor) đánh giá quy mô tính năng là khá đồ sộ đối với 1 nhóm 5 người làm Capstone. Nếu phát triển đồng thời cả hệ thống Web App và Native Mobile App (iOS/Android) sẽ đối mặt với rủi ro cực lớn về quá tải công việc (Scope Creep) và không đảm bảo chất lượng.

## Quyết định (Decision)
- **Chính thức loại bỏ** việc phát triển Native Mobile Application (iOS/Android) khỏi phạm vi của Version 1 (v1).
- **Tập trung toàn lực** vào thiết kế Responsive Web-based platform (ReactJS/Vite) cho cả phân hệ Quản trị (Admin) và Bán hàng tại quầy (POS).
- Các tính năng mở rộng liên quan đến Mobile Native sẽ chuyển sang "Backlog / Future Versions" (v2) sau khi hoàn thiện và đánh giá (validate) phiên bản Web.

## Hệ quả (Consequences)
- **Tích cực**: Tiết kiệm tài nguyên phát triển, giảm chi phí learning curve đối với framework Mobile, tập trung đảm bảo tiến độ và chất lượng cho phân hệ Web App vốn yêu cầu logic phức tạp (FEFO, QR payment, AI).
- **Hạn chế**: Ứng dụng Web POS trên điện thoại có thể gặp hạn chế về trải nghiệm quét barcode bằng camera gốc của thiết bị (so với Native App), nhưng vẫn có thể dùng máy quét mã vạch rời qua USB/Bluetooth.
