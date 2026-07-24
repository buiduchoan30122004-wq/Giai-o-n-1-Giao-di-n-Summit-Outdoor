# Bản Cập nhật Cấu hình 3 hàm MCP & Tự động hóa cho Summit Outdoor

Tài liệu này tổng hợp 3 tính năng/hàm MCP được lựa chọn để xây dựng cho AI Agent của bạn trên Telegram, kèm theo các ví dụ câu lệnh thực tế mà bạn sẽ sử dụng hàng ngày.

---

## 1. write_marketing_post (Sáng tạo nội dung Fanpage / Blog từ sản phẩm)
*   **Tên function:** `write_marketing_post`
*   **Tham số đầu vào (Input params):**
    *   `product_id` (Kiểu: `number`, Tùy chọn) hoặc `product_name` (Kiểu: `string`, Tùy chọn): Định danh sản phẩm cụ thể.
    *   `platform` (Kiểu: `string`): Nhận giá trị `fanpage` (bài Facebook ngắn, cuốn hút) hoặc `blog` (bài viết dài chuẩn SEO).
    *   `tone` (Kiểu: `string`, Tùy chọn): Giọng văn (ví dụ: `hai_huoc`, `chuyen_nghiep`, `trai_nghiem`).
*   **Kết quả đầu ra dự kiến (Expected output):**
    *   Nội dung bài viết marketing hoàn chỉnh chứa thông tin chính xác về tên, thương hiệu, giá bán thực tế và các size đang có sẵn của sản phẩm lấy từ database.
*   **Tình huống sử dụng hàng ngày:** Bạn muốn đăng bài quảng cáo sản phẩm lên mạng xã hội hoặc website nhanh chóng mà không cần tự viết.
*   **Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Viết cho anh một bài đăng fanpage giọng dí dỏm giới thiệu đôi giày Salomon Speedcross"*
    *   *"Soạn bài blog chi tiết hướng dẫn chọn size cho sản phẩm ID 12"*
    *   *"Lên bài đăng Facebook quảng cáo mẫu sản phẩm Altra mới"*

---

## 2. push_order_notification (Tự động báo đơn & Duyệt nhanh qua Telegram)
*   **Cơ chế hoạt động:** 
    *   **Chiều gửi đi (Push):** Khi có đơn hàng mới (chưa thanh toán / đã thanh toán qua SePay / cần duyệt tay), Website tự động gửi tin nhắn báo về Telegram của bạn.
    *   **Chiều tương tác (Interact):** Dưới mỗi tin nhắn thông báo sẽ có các nút bấm tương tác (ví dụ: `[Duyệt đơn]`, `[Hủy đơn]`). Khi bạn bấm nút hoặc nhắn tin phản hồi, Agent sẽ tự động chạy hàm cập nhật cơ sở dữ liệu và gửi mail cho khách.
*   **Kết quả đầu ra dự kiến (Expected output):**
    *   Tin nhắn báo đơn thời gian thực.
    *   Cập nhật trạng thái đơn hàng trong database và tự động gửi email xác nhận đặt hàng + email cảm ơn thông qua Resend sau khi được duyệt.
*   **Tình huống sử dụng hàng ngày:** Giám sát dòng tiền và trạng thái mua sắm của khách hàng ngay tức thì.
*   **Ví dụ sự kiện và câu nhắn Telegram sẽ trigger:**
    *   *Website tự động gửi:* `[ĐƠN HÀNG MỚI] SUMMIT1004 - Khách hàng: Nguyễn Văn A (0912xxxxxx) đặt mua 1 Giày Salomon. Số tiền: 2.500.000 VND. Trạng thái: Chờ thanh toán. [Nút bấm: Duyệt đơn] [Nút bấm: Hủy đơn]`
    *   *Bạn tương tác bằng cách click nút:* Bấm nút **[Duyệt đơn]** ngay bên dưới tin nhắn báo của Telegram.
    *   *Hoặc bạn tự nhắn tin:* *"Duyệt thanh toán đơn SUMMIT1004"* -> Agent sẽ kích hoạt cập nhật trạng thái và gửi mail cảm ơn.

---

## 3. list_pending_orders (Liệt kê danh sách đơn hàng chờ xử lý/chưa thanh toán)
*   **Tên function:** `list_pending_orders`
*   **Tham số đầu vào (Input params):**
    *   `limit` (Kiểu: `number`, Tùy chọn): Số lượng đơn hàng tối đa hiển thị. Mặc định là `10`.
*   **Kết quả đầu ra dự kiến (Expected output):**
    *   Danh sách chi tiết các đơn hàng ở trạng thái `pending` (chưa trả tiền) bao gồm: Mã đơn, tên khách, số điện thoại, giá trị đơn hàng, thời gian đặt để bạn tiện liên hệ chăm sóc.
*   **Tình huống sử dụng hàng ngày:** Tra cứu nhanh danh sách các đơn hàng chưa hoàn tất cuối ngày để gọi điện chăm sóc khách hàng hoặc chuẩn bị đóng gói hàng.
*   **Ví dụ câu nhắn Telegram sẽ trigger:**
    *   *"Danh sách đơn hàng chưa thanh toán hôm nay là gì?"*
    *   *"Xem hộ em những đơn hàng nào đang chờ duyệt"*
    *   *"Liệt kê 5 đơn hàng đang ở trạng thái pending"*
