---
id: LL-2026-10-02-427
title: "Khắc phục lỗi Chart.js tràn layout và UX luồng Hóa đơn điện tử (Thuế 2026)"
date: "2026-10-02"
author: AI-Agent
scope: frontend
severity: medium
resolution: resolved
tags: [lesson, agent-generated]
---

# LL-2026-10-02-427: Khắc phục lỗi Chart.js tràn layout và UX luồng Hóa đơn điện tử (Thuế 2026)

## Problem
1. Thẻ canvas của Chart.js khi sử dụng maintainAspectRatio=false tự động co giãn và tràn chiều dọc vô tận làm vỡ layout. 2. Cần xây dựng luồng UI xử lý Hóa đơn điện tử (Thuế 2026) đáp ứng việc gom bill, xem chi tiết hóa đơn (mô phỏng PDF) và phát hành XML lên CQT.

## Solution
1. Fix Chart.js: Bắt buộc bọc thẻ canvas vào một container div có thuộc tính relative và giới hạn chiều cao cố định (VD: tailwind `relative h-72 w-full`). 2. Nghiệp vụ HĐĐT: Dùng Modal chứa danh sách checkbox để lọc các bill 'Chưa phát hành' nhằm giải quyết bài toán gom bill cuối ngày. Dùng Drawer (ngăn trượt) để hiển thị chi tiết hóa đơn, bổ sung thêm một Modal (Full-screen) chứa layout HTML mô phỏng tờ Hóa Đơn GTGT thực tế khi bấm 'Xem bản thể hiện PDF'.