# Hướng dẫn Triển khai MCP HTTP Server (Streamable-HTTP)

Đây là tài liệu hướng dẫn triển khai máy chủ MCP HTTP Server chạy dịch vụ chạy nền (systemd service) trên cổng `3001` localhost của VPS.

---

## 1. Cài đặt các thư viện phụ thuộc

Truy cập thư mục `mcp` và cài đặt các gói thư viện:

```bash
cd /opt/summit-outdoor/mcp
npm install
```

---

## 2. File cấu hình dịch vụ Systemd mẫu

Tạo file dịch vụ hệ thống tại đường dẫn `/etc/systemd/system/summit-mcp.service`:

```ini
[Unit]
Description=Summit Outdoor MCP HTTP Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/summit-outdoor/mcp
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5

# Các biến môi trường cần thiết
Environment=PORT=3001
Environment=DATABASE_PATH=/opt/summit-outdoor/data/brain.db
Environment=RESEND_API_KEY=your_resend_api_key_here

[Install]
WantedBy=multi-user.target
```

*Lưu ý: Hãy đảm bảo đường dẫn `/usr/bin/node` là chính xác trên hệ thống của bạn (có thể kiểm tra bằng lệnh `which node`).*

---

## 3. Quản lý dịch vụ trên VPS

Chạy các lệnh sau với quyền `root` để kích hoạt và chạy dịch vụ:

```bash
# Nạp lại cấu hình systemd
sudo systemctl daemon-reload

# Kích hoạt tự khởi động cùng hệ thống
sudo systemctl enable summit-mcp.service

# Khởi chạy dịch vụ
sudo systemctl start summit-mcp.service

# Kiểm tra trạng thái hoạt động
sudo systemctl status summit-mcp.service
```

---

## 4. Kiểm tra sức khỏe dịch vụ (Health Check)

Dịch vụ chạy ngầm chỉ bind duy nhất vào IP `127.0.0.1` (localhost). Để kiểm tra xem dịch vụ đã chạy thành công ở cổng `3001` chưa, chạy lệnh:

```bash
curl -i http://127.0.0.1:3001/health
```

Kết quả phản hồi mong đợi:
```json
{"status":"healthy","server":"summit-mcp-http-server"}
```
