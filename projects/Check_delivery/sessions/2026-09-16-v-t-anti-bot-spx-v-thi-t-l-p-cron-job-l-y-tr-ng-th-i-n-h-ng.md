---
id: SES-2026-09-16-494
date: "2026-09-16"
author: AI-Agent
project: Check_delivery
goals: ["Phân tích lỗi API SPX trả về object rỗng {}","Cung cấp giải pháp Iframe Clipping để lấy trạng thái mà không cần API key","Cung cấp giải pháp headless browser (puppeteer-core) để lấy trạng thái Text thô (miễn phí)","Thiết lập Cron Job tự động cập nhật trạng thái đơn chưa giao"]
status: completed
files_changed: ["components/OrderCard.js","lib/spxScraper.js","app/api/track/route.js","lib/db.js","app/api/cron/route.js","vercel.json"]
tags: [session, summary]
---

# Session Summary: Vượt anti-bot SPX và thiết lập Cron Job lấy trạng thái đơn hàng

Trong phiên này, chúng ta đã phát hiện rằng hệ thống anti-bot của Shopee Express (SPX) trả về data rỗng `{}` khi API được gọi từ server mà không có các token hợp lệ.
Ban đầu, một giải pháp 'Iframe Clipping' được áp dụng để hiển thị tracking widget bằng cách giấu header. Tuy nhiên, sau đó user yêu cầu lấy trạng thái text thô tự động và miễn phí.
Giải pháp cuối cùng: Dùng headless browser (puppeteer-core + @sparticuz/chromium) chạy trên Vercel Serverless Function để giả lập trình duyệt, vào trang SPX, bóc tách dòng Text trạng thái và lịch sử giao hàng. Dữ liệu được cache lại bằng @vercel/kv để tăng tốc.
Cron Job cũng được cấu hình để mỗi giờ tự chạy (bằng cron-job.org do Vercel Free giới hạn 1 lần/ngày) để kiểm tra các đơn hàng chưa giao. Các đơn hàng giao thành công sẽ bị cron bỏ qua, tiết kiệm resource.