---
title: Project Overview
description: Tổng quan dự án MT-GRMS, mục tiêu, GAPs và phạm vi tính năng.
---

# 🚀 Dự án MT-GRMS (Multi-Tenant Grocery Retail Management System)

**Tên tiếng Việt:** Hệ Thống Cung Cấp Dịch Vụ Quản Lý Tạp Hóa Bán Lẻ
**Loại phần mềm:** Web App (SaaS Multi-tenant)
**Nhóm thực hiện:** SEP490-G84

---

## 1. Bối cảnh & Vấn đề cốt lõi (Pain Points)

Các cửa hàng tạp hóa, siêu thị mini vừa và nhỏ đang gặp phải các vấn đề sau (GAPs):
- **GAP-01 & GAP-02**: Thất thoát hàng hóa (chiếm 5-8% giá trị) do hết hạn sử dụng, không kiểm soát được theo nguyên tắc FEFO (First Expired, First Out).
- **GAP-03**: Công nợ ghi chép sổ sách thủ công, khó đối soát giữa khách hàng và nhà cung cấp.
- **GAP-04**: Tính toán sai lệch chi phí vốn (COGS) và chi phí vận hành (điện, nước, mặt bằng).
- **GAP-05**: Thiếu hệ thống Dashboard, báo cáo theo thời gian thực để ra quyết định.
- **GAP-06**: Chậm trễ ở khâu thanh toán POS do thao tác thủ công, ùn tắc khách hàng lúc cao điểm.

---

## 2. Giải pháp Đề xuất

MT-GRMS cung cấp một hệ thống quản lý tinh gọn, tập trung xử lý các điểm nghẽn chính:
- Tự động hóa cảnh báo hàng cận date và gợi ý xuất hàng theo lô (FEFO).
- Tích hợp thanh toán quét mã VietQR động trực tiếp tại quầy POS với âm thanh thông báo.
- Thiết kế Multi-Tenant (SaaS) cho phép chủ cửa hàng đăng ký sử dụng dưới dạng gói cước mà không cần đầu tư hạ tầng phần mềm phức tạp.

---

## 3. Phạm vi Dự án (Project Scope - 26 Features)

Tổng hợp 26 tính năng chính chia thành các phân hệ lõi:
1. **Quản lý Hàng hóa & Tồn kho**: Khởi tạo sản phẩm, quản lý đa đơn vị, lô hạn sử dụng FEFO (FE-02), kiểm kê kho (FE-04), điều chuyển kho liên chi nhánh (FE-15).
2. **Mua hàng & Vận hành**: Đơn đặt hàng PO & Landed Cost (FE-05), xuất hủy nội bộ (FE-06), chi phí dịch vụ (FE-07).
3. **Quầy POS & Thanh toán**: Bán hàng quét mã vạch siêu tốc (FE-12), tích hợp VietQR động (FE-13), đặt hàng trước (FE-14), hệ thống khuyến mãi & Voucher (FE-16).
4. **Tài chính & CRM**: Khách hàng (FE-08), Nhà cung cấp (FE-09), Sổ quỹ tiền mặt (FE-17), Tính thuế hộ kinh doanh (FE-19), Báo cáo Lãi/Lỗ P&L (FE-10).
5. **Nhân sự & Lương**: Quản lý ca làm việc, chấm công, tính lương và hoa hồng (FE-18).
6. **SaaS Admin, AI & Bảo mật**: Phân quyền RBAC, xác thực 2FA (FE-11), gợi ý bán hàng bằng AI LLM (FE-21), quản trị tenant & gói cước (FE-22, 23, 25).
7. **Omnichannel**: Tích hợp đối tác giao hàng GHN (FE-20), Mini Web Store bán hàng trực tuyến (FE-26).

---

## 4. Mô hình Dữ liệu khái niệm (Conceptual Data Model)

Hệ thống bao gồm tối thiểu 20-22 thực thể nghiệp vụ cốt lõi, tập trung vào:
- `Tenants`, `Users`, `Roles`, `Stores`, `Branches` (Quản lý đa khách hàng và chi nhánh)
- `Products`, `ProductUnits`, `Batches`, `Categories` (Hàng hóa & Lô hạn)
- `StockOnHand`, `PurchaseOrders`, `PurchaseOrderDetails`, `Invoices`, `InvoiceDetails` (Kho & Giao dịch)
- `Customers`, `Suppliers`, `CashbookTransactions`, `ServiceExpenses` (Đối tác & Dòng tiền)
- `Subscriptions`, `AuditLogs` (SaaS & Hệ thống)

*Cập nhật lần cuối từ: Báo cáo Report-1, Report-2, Report-3 (SRS).*
