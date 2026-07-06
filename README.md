# 🌌 Cosmic English AI (Local Sharing Platform)

Cosmic English AI là một nền tảng chia sẻ bài học tiếng Anh và các Prompt mẫu (cho ChatGPT/Claude) được thiết kế đặc tả chạy cục bộ (Offline Native System) với giao diện mang phong cách vũ trụ (Galaxy Gradient & Glassmorphism) hiện đại, mượt mà.

---

## 🚀 Các Tính Năng Chính
1.  **Lưu trữ & Chia sẻ**: Xem các bài học tiếng Anh được phân loại theo chuyên mục (AI Prompts, Ngữ pháp, Từ vựng, Phương pháp, Đánh giá công cụ).
2.  **Cơ chế Guest Paywall (BR-01, BR-02)**: Khách vãng lai (Guest) chưa đăng nhập được đọc tối đa **3 bài viết khác nhau**. Lịch sử đọc được lưu trữ vĩnh viễn trong `localStorage` (`cosmic_read_history`). Từ bài viết thứ 4 trở đi, nội dung chi tiết và prompt sẽ bị làm mờ (blur 8px) và xuất hiện banner yêu cầu Đăng ký/Đăng nhập.
3.  **Xác thực thành viên (BR-03)**: Tài khoản và phiên đăng nhập được đồng bộ và lưu trữ cục bộ. Đăng nhập thành công sẽ mở khóa không giới hạn toàn bộ nội dung.
4.  **Admin Dashboard (BR-04)**: Cho phép quản trị viên thêm bài viết mới và Prompt đi kèm ngay trên giao diện web. Bài viết mới sẽ xuất hiện trực tiếp tại trang chủ.
5.  **Trình biên dịch Markdown**: Hiển thị nội dung bài viết định dạng Markdown (tiêu đề, in đậm, in nghiêng, danh sách, khối mã code) chuyên nghiệp.

---

## 🛠️ Cài Đặt & Chạy Ứng Dụng

Vì đây là nền tảng chạy offline hoàn chỉnh, bạn có thể khởi chạy bằng 2 cách:

### Cách 1: Khởi Chạy Bằng Node.js Local Server (Khuyên Dùng & Tránh Lỗi)
Vì các trình duyệt hiện đại (Chrome, Edge) chặn truy cập `localStorage`/`sessionStorage` khi mở file bằng giao thức tĩnh `file://`, chạy qua Local Server là cách ổn định nhất:

1.  Đảm bảo bạn đã cài đặt **Node.js** trên máy tính.
2.  Mở Terminal tại thư mục gốc của dự án (`C:\Users\ADMIN\Code`) và chạy lệnh:
    ```bash
    npm start
    ```
    *(Hoặc chạy lệnh `node server.js` trực tiếp)*
3.  Truy cập ứng dụng tại địa chỉ hiển thị trên Terminal: [http://localhost:8080](http://localhost:8080) (hoặc `8081` nếu `8080` đang bị sử dụng).

### Cách 2: Chạy Tệp Tĩnh Trực Tiếp (Mở Bằng Firefox/Safari)
Chỉ cần click đúp chuột vào tệp `index.html` để mở trực tiếp trên trình duyệt. 
*Lưu ý: Một số trình duyệt như Chrome/Edge có thể chặn tính năng đăng nhập hoặc đếm lượt xem do chính sách bảo mật giao thức `file://` đối với `localStorage`.*

---

## 🔑 Tài Khoản Mặc Định
*   **Quản trị viên (Admin)**: Tên đăng nhập `admin` / Mật khẩu `admin`
*   **Thành viên mẫu (User)**: Tên đăng nhập `user` / Mật khẩu `123`

*(Bạn có thể tự do Đăng ký tài khoản mới trực tiếp trên giao diện để trải nghiệm).*

---

## 🧪 Chạy Unit Test Của Dự Án
Dự án được xây dựng sẵn bộ unit test tự động (standalone) để kiểm thử bộ biên dịch Markdown và logic nghiệp vụ cơ bản. Bạn có thể chạy test bất cứ lúc nào qua Node.js bằng cách thực thi lệnh:
```bash
node tests/test_logic.js
```
