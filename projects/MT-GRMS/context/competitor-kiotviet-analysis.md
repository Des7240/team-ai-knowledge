---
title: Phân tích Đối thủ - KiotViet
description: Phân tích tính năng Hàng hóa Lô – Hạn sử dụng của KiotViet và so sánh với giải pháp MT-GRMS.
---

# 🚀 Phân tích Hệ thống KiotViet và So sánh với MT-GRMS

**Tài liệu tham khảo:** [KiotViet - Hướng dẫn sử dụng tính năng Hàng hóa Lô – Hạn sử dụng](file:///d:/01_DU_AN/Do_an_fall26/KiotViet%20-%20Ph%E1%BA%A7n%20m%E1%BB%81m%20qu%E1%BA%A3n%20l%C3%BD%20b%C3%A1n%20h%C3%A0ng%20Ph%E1%BB%95%20Bi%E1%BA%BFn%20Nh%E1%BA%A5t.html)

---

## 1. Phân tích Tính năng cốt lõi của KiotViet (Hàng hóa Lô - Hạn sử dụng)

Tính năng quản lý theo Lô và Hạn sử dụng của KiotViet được thiết kế phục vụ các ngành hàng có vòng đời sản phẩm ngắn hạn như: Tạp hóa, Siêu thị mini, Mỹ phẩm, Mẹ & Bé, Nhà thuốc, Thực phẩm.

### 1.1 Lợi ích nổi bật
- **Kiểm soát Tồn kho minh bạch:** Quản lý số lượng và giá vốn chi tiết đến từng lô hàng. Mọi giao dịch nhập, xuất, chuyển, hủy đều được theo vết theo lô để tránh thất thoát.
- **Tối ưu Xuất kho (FEFO):** Hệ thống tự động gợi ý xuất bán các lô hàng có hạn sử dụng gần nhất theo nguyên tắc FEFO (First Expired, First Out - Hết hạn trước, Xuất trước). 
- **Cảnh báo Thông minh:** KiotViet cung cấp cảnh báo bằng màu sắc (vàng: sắp hết hạn, đỏ: đã hết hạn) ngay trên màn hình bán hàng POS, giúp nhân viên chủ động đẩy bán hoặc xả hàng.

### 1.2 Các thao tác và luồng nghiệp vụ cơ bản
- **Thiết lập:** Cần phải bật tính năng "Quản lý tồn kho theo Lô, hạn sử dụng" trong mục Thiết lập cửa hàng.
- **Thêm mới Hàng hóa:** Có tuỳ chọn (checkbox) `Quản lý theo lô, hạn sử dụng`.
- **Nhập hàng:** Phải nhập thông tin *Tên Lô*, *Hạn sử dụng*, *Số lượng* và *Đơn giá* chi tiết cho lô đó khi tạo phiếu Nhập hàng.
- **Bán hàng / POS:** Khi đưa sản phẩm vào giỏ hàng, hệ thống tự động chọn lô theo quy tắc FEFO. Nhân viên thu ngân (cashier) vẫn có quyền chọn lại một lô khác thông qua pop-up thả xuống.
- **Các nghiệp vụ khác:** Hỗ trợ tính năng lô cho Trả hàng, Chuyển kho, Kiểm kho và Xuất hủy.

### 1.3 Nền tảng hỗ trợ
KiotViet phát triển một hệ sinh thái đầy đủ:
- Giao diện Web App cho Quản trị viên (Admin).
- Ứng dụng di động (KiotViet App) để xem báo cáo, thêm hàng, bán hàng lưu động.
- Máy POS Android dành riêng cho quầy thu ngân.

---

## 2. So sánh KiotViet với Hệ thống MT-GRMS

| Tiêu chí | KiotViet (Giải pháp Thương mại) | MT-GRMS (Dự án SEP490-G84) |
| --- | --- | --- |
| **Mục tiêu Khách hàng** | Đa ngành nghề, từ cửa hàng bán lẻ nhỏ đến chuỗi doanh nghiệp lớn, đa dạng nhiều lĩnh vực (F&B, Khách sạn, Bán lẻ). | Tập trung chuyên sâu cho **Tạp hóa, Siêu thị mini vừa và nhỏ** (GAP-01, GAP-02). |
| **Mô hình Dịch vụ** | Thu phí bản quyền định kỳ (Subscription) khá cao, có nhiều gói dịch vụ phức tạp. | SaaS Multi-Tenant với chi phí triển khai được tối ưu hóa cho hộ kinh doanh nhỏ lẻ, đơn giản trong việc kích hoạt. |
| **Quản lý Hạn sử dụng (FEFO)** | Hỗ trợ toàn diện, cảnh báo màu sắc tại màn hình POS, tự động gợi ý xuất lô theo FEFO. | Tính năng **FE-02** & **FE-12** hỗ trợ triệt để FEFO tương tự như KiotViet. Đặc biệt tập trung vào việc giảm ùn tắc POS. |
| **Giao diện & Cấu hình** | Hệ thống cồng kềnh, nhiều chức năng dư thừa đối với một tiệm tạp hóa nhỏ, làm tăng độ phức tạp (learning curve). | Tối giản, tập trung giải quyết đúng **Pain points** (GAPs) giúp chủ cửa hàng dễ dàng thao tác mà không cần kiến thức IT/Kế toán. |
| **Thanh toán & POS** | Hỗ trợ nhiều kênh, thanh toán QR tĩnh/động. | Tính năng **FE-13** tích hợp VietQR động với **âm thanh thông báo giao dịch**, nhắm vào tốc độ xử lý nhanh lúc cao điểm (GAP-06). |
| **Công nghệ Hỗ trợ** | Các công nghệ phần mềm truyền thống, có app mobile, POS hardware. | Áp dụng công nghệ hiện đại, có cả **AI LLM (FE-21)** gợi ý bán hàng thông minh dựa trên intent của khách hàng. |
| **Quản lý Nợ & Sổ Quỹ** | Có các module kế toán nâng cao phức tạp, hạch toán và liên kết hóa đơn điện tử. | Đơn giản hóa qua tính năng **FE-08** & **FE-09** tập trung vào Sổ quỹ tiền mặt và cảnh báo hạn mức nợ dễ hiểu cho chủ cửa hàng. |

---

## 3. Bài học & Định hướng áp dụng cho MT-GRMS

Từ việc phân tích tính năng của KiotViet, dự án MT-GRMS có thể học hỏi và áp dụng những điểm sau để thiết kế hệ thống tối ưu hơn:

1. **Giao diện POS trực quan:** Áp dụng nguyên lý hiển thị cảnh báo bằng màu sắc (Traffic Light Concept - Đỏ/Vàng/Xanh) cho các lô hàng cận date ngay tại màn hình thanh toán POS để nhân viên dễ dàng nhận diện.
2. **Quyền linh hoạt khi chọn Lô (FEFO):** Mặc dù hệ thống MT-GRMS sẽ tự động chọn lô cận date nhất (FEFO), nhưng vẫn phải cho phép nhân viên thao tác ghi đè (override) để chọn lô khác trong trường hợp hàng thực tế trên kệ không khớp, tương tự cách pop-up chọn lô của KiotViet hoạt động.
3. **Luồng dữ liệu đồng nhất:** Phải thiết kế Database để mọi bảng nghiệp vụ như `PurchaseOrderDetails`, `InvoiceDetails`, `StockOnHand` đều phải tham chiếu trực tiếp đến `Batches` (ID của lô) nhằm theo vết chính xác dòng đời của sản phẩm.
4. **Loại bỏ sự rườm rà:** MT-GRMS sẽ không đưa các tùy chọn phức tạp (ví dụ: cài đặt thuế phức tạp đa tầng) vào giao diện thiết lập hàng hóa, nhằm giúp người dùng có thể kích hoạt tính năng Lô/Hạn sử dụng chỉ với 1 cú click.

---
*Tài liệu được phân tích và trích xuất để làm kiến thức cơ sở (Knowledge Base) định hướng thiết kế UI/UX và logic cho phân hệ Quản lý Hàng hóa của MT-GRMS.*
