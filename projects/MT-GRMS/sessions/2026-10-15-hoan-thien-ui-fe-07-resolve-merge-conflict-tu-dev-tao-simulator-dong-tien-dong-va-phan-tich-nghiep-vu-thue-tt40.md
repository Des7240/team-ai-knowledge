---
id: SES-2026-10-15-183
date: "2026-10-15"
author: AI-Agent
project: MT-GRMS
epic: "FE-07-FE-08-Finance-Architecture"
goals: ["Tái cấu trúc giao diện FE-07 (Chi phí dịch vụ) đồng bộ với StoreOwnerLayout và thiết kế chung của hệ thống","Bổ sung tính năng upload file chứng từ có preview và lọc chi phí theo kỳ thời gian linh hoạt","Giải quyết triệt để xung đột merge conflict khi pull code từ origin/dev vào router.tsx, AppTopNav.tsx, CustomerTable.tsx","Xây dựng ứng dụng HTML/CSS/JS mô phỏng động dòng tiền và kiến trúc tài chính khép kín Finance-Cashflow-Tax","Làm rõ nghiệp vụ thuế Hộ kinh doanh theo Thông tư 40, cơ chế mua nợ/thanh toán nợ NCC và bản chất thuế GTGT 1% vs 8%/10%"]
status: completed
files_changed: ["src/features/service-expenses/service-expenses.css","src/features/service-expenses/utils/datePeriodUtils.ts","src/features/service-expenses/types/expense.types.ts","src/features/service-expenses/api/expenseApi.ts","src/features/service-expenses/hooks/useServiceExpenses.ts","src/features/service-expenses/components/CreateExpenseModal.tsx","src/features/service-expenses/components/ExpenseFilterBar.tsx","src/features/service-expenses/components/ExpenseKpiCards.tsx","src/features/service-expenses/pages/ServiceExpensesPage.tsx","src/app/router.tsx","src/layouts/StoreOwnerLayout/AppTopNav.tsx","src/features/customer-crm/components/CustomerTable.tsx","docs/worklogs/2026-10-13_FE-07_AnNT_service-expenses-management-ui.md","docs/architecture/finance-cashflow-architecture.html"]
tags: [session, summary]
---

# Session Summary: Hoàn thiện UI FE-07, Resolve Merge Conflict từ dev, Tạo Simulator Dòng Tiền Động và Phân Tích Nghiệp Vụ Thuế TT40

Phiên làm việc đã hoàn thành toàn diện các nhiệm vụ trọng tâm:

1. **Tái cấu trúc & Nâng cấp Frontend FE-07 (Chi phí vận hành)**:
   - Xây dựng stylesheet chuyên biệt `service-expenses.css` theo chuẩn BEM và bảng màu Deep Teal (#0F766E), bo tròn `24px` & `9999px` khớp hoàn toàn với `StoreOwnerLayout` và `AppTopNav`.
   - Nâng cấp modal ghi nhận chi phí hỗ trợ đính kèm file ảnh/PDF (drag-and-drop & file picker có preview) song song với dán link URL.
   - Bổ sung bộ lọc kỳ kế toán linh hoạt (Tháng này, tháng trước, quý này, năm nay, month picker, date range) và tự động tính toán lại 4 thẻ KPI summary theo kỳ.
   - Viết tệp worklog chuẩn `2026-10-13_FE-07_AnNT_service-expenses-management-ui.md` và cung cấp mô tả PR hoàn chỉnh.

2. **Giải quyết triệt để xung đột Merge Conflict từ origin/dev**:
   - Áp dụng phương án Smart Additive Merge cho cả 3 file xung đột: `router.tsx`, `AppTopNav.tsx` và `CustomerTable.tsx`.
   - Giữ trọn vẹn 100% các route mới của dev (POS, Hàng hóa, Chuyển kho, Nhân sự, Khuyến mãi) và toàn bộ các tính năng tài chính của An (FE-07, FE-08, FE-10, FE-17, FE-19).
   - Kiểm chứng biên dịch `npm run build`: thành công 100% với 2399 modules, 0 lỗi TypeScript và 0 lỗi Vite.

3. **Xây dựng Interactive Finance-Cashflow-Tax Simulator**:
   - Tạo ứng dụng độc lập `docs/architecture/finance-cashflow-architecture.html` phong cách Fintech Glassmorphism.
   - Mô phỏng động bằng Canvas dòng chảy tiền mặt/ngân hàng từ 2 Inflows (POS, FE-08 AR) qua Két trung tâm FE-17 tới 4 Outflows (FE-07 OpEx, AP NCC, FE-18 Payroll, FE-19 Tax) và Bộ não P&L FE-10.
   - Tích hợp Live Counter, Transaction Feed, Node Inspector và bảng phân tích 8 điểm gãy luồng (GAP-01 đến GAP-08).

4. **Làm rõ bản chất Nghiệp vụ Thuế & Dòng tiền**:
   - Xác định vị trí thiết lập thuế suất tại FE-19 (`TaxRateSettingsView.tsx` - 1.0% GTGT + 0.5% TNCN theo TT40/2021).
   - Phân tích sâu: Mua nợ NCC (AP) không ảnh hưởng đến số thuế phải nộp vì thuế HKD tính trên doanh thu bán ra tại quầy.
   - Giải đáp bản chất thời điểm tính thuế theo Điều 8 Thông tư 40: Bán hàng giao xong tại quầy là tính thuế ngay, không phân biệt khách đã trả tiền hay mua nợ ghi sổ.
   - Làm rõ sự khác biệt giữa phương pháp tính thuế trực tiếp 1% của HKD và phương pháp khấu trừ 8%/10% của Doanh nghiệp (HKD không được cộng thêm dòng VAT 8%/10% trên hóa đơn bán lẻ).
   - Chỉ ra điểm mù còn thiếu trong FE-10: Cần bổ sung mục 'Chi phí dự phòng & Xóa nợ khó đòi' (liên kết từ FE-08) để tránh báo cáo lãi ảo khi khách bùng nợ.