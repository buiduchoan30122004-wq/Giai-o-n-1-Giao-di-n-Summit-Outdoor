import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@libsql/client';
import { Resend } from 'resend';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Database Client
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), '../brain.db');
const dbClient = createClient({
  url: `file:${dbPath}`
});

// Initialize Resend Client
const FROM_EMAIL = 'Summit Outdoor <no-reply@summitoutdoor.io.vn>';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Log function to console with timestamp
function log(msg) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${msg}`);
}

// Function to create a fresh Server instance for each connection
function createMcpServer() {
  const mcpServer = new Server(
    {
      name: "summit-mcp-http-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Define tools list
  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    log("Received ListTools request");
    return {
      tools: [
        {
          name: "write_marketing_post",
          description: "Generate a marketing post for Facebook Fanpage or a Blog post for a product from the database.",
          inputSchema: {
            type: "object",
            properties: {
              product_id: { type: "number", description: "ID of the product (optional)" },
              product_name: { type: "string", description: "Name of the product (optional)" },
              platform: { type: "string", enum: ["fanpage", "blog"], description: "Platform to write for: 'fanpage' (short Facebook post) or 'blog' (markdown blog post)" },
              tone: { type: "string", description: "Tone of voice (e.g. 'dân chạy trail', 'hài hước', 'chuyên nghiệp')" }
            },
            required: ["platform"]
          }
        },
        {
          name: "list_pending_orders",
          description: "List detailed list of pending/unpaid orders from the database.",
          inputSchema: {
            type: "object",
            properties: {
              limit: { type: "number", description: "Maximum number of orders to list (default: 10)" }
            }
          }
        },
        {
          name: "confirm_order",
          description: "Confirm payment for an order by its code. This updates database status to 'confirmed' and triggers Resend confirmation emails.",
          inputSchema: {
            type: "object",
            properties: {
              order_code: { type: "string", description: "The order code to confirm (e.g. SUMMIT1004)" },
              payment_method: { type: "string", description: "Payment method (default: 'bank_transfer')" }
            },
            required: ["order_code"]
          }
        },
        {
          name: "get_business_signals",
          description: "Retrieve recent business signals including new orders, new customer leads, and today's summary metrics.",
          inputSchema: {
            type: "object",
            properties: {
              time_window_minutes: { type: "number", description: "How many minutes back to look for new events (default: 5)" }
            }
          }
        }
      ]
    };
  });

  // Handle tool calls
  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    log(`CallTool invoked: ${name} with args: ${JSON.stringify(args)}`);

    try {
      if (name === "write_marketing_post") {
        let product = null;
        if (args.product_id) {
          if (typeof args.product_id !== 'number') {
            throw new Error("Invalid parameter: product_id must be a number");
          }
          const res = await dbClient.execute({
            sql: "SELECT * FROM products WHERE id = ?",
            args: [args.product_id]
          });
          if (res.rows.length > 0) product = res.rows[0];
        } else if (args.product_name) {
          if (typeof args.product_name !== 'string') {
            throw new Error("Invalid parameter: product_name must be a string");
          }
          const res = await dbClient.execute({
            sql: "SELECT * FROM products WHERE name LIKE ? LIMIT 1",
            args: [`%${args.product_name}%`]
          });
          if (res.rows.length > 0) product = res.rows[0];
        } else {
          // Get a random product
          const res = await dbClient.execute("SELECT * FROM products ORDER BY RANDOM() LIMIT 1");
          if (res.rows.length > 0) product = res.rows[0];
        }

        if (!product) {
          log(`write_marketing_post: No product found matching criteria.`);
          return {
            content: [{ type: "text", text: "Không tìm thấy sản phẩm phù hợp trong cơ sở dữ liệu." }]
          };
        }

        const tone = args.tone || "năng động, phong cách chạy trail";
        const platform = args.platform;

        log(`write_marketing_post success: found product ID ${product.id}`);
        return {
          content: [{
            type: "text",
            text: `Đã tìm thấy sản phẩm trong database:\n` +
                  `- Tên: ${product.name}\n` +
                  `- Thương hiệu: ${product.brand}\n` +
                  `- Giá: ${product.price.toLocaleString('vi-VN')} đ\n` +
                  `- Màu sắc: ${product.available_colors || 'N/A'}\n` +
                  `- Size: ${product.available_sizes || 'N/A'}\n` +
                  `- Danh mục: ${product.category || 'N/A'}\n` +
                  `- Thông tin mô tả: ${product.features || ''}\n\n` +
                  `Yêu cầu bạn hãy viết một bài đăng ${platform === 'fanpage' ? 'Fanpage Facebook' : 'Blog chuẩn SEO'} cho sản phẩm này với giọng văn "${tone}".`
          }]
        };
      }

      if (name === "list_pending_orders") {
        const limit = args.limit || 10;
        if (typeof limit !== 'number' || limit <= 0) {
          throw new Error("Invalid parameter: limit must be a positive number");
        }
        
        const res = await dbClient.execute({
          sql: `
            SELECT 
              o.id, o.customer_id, o.product_id, o.quantity, o.total_price, o.status, o.created_at, o.order_code,
              o.address, o.notes, o.transaction_id, o.payment_amount, o.payment_date, o.payment_method,
              c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
              p.brand as product_brand, p.name as product_name, p.price as product_price
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            LEFT JOIN products p ON o.product_id = p.id
            WHERE o.status = 'pending'
            ORDER BY o.id DESC
            LIMIT ?
          `,
          args: [limit]
        });

        if (res.rows.length === 0) {
          log("list_pending_orders: No pending orders found.");
          return {
            content: [{ type: "text", text: "Hiện không có đơn hàng nào ở trạng thái chờ thanh toán (pending)." }]
          };
        }

        // Group items by order_code
        const groupedMap = new Map();
        for (const row of res.rows) {
          const key = row.order_code || `ID_${row.id}`;
          if (!groupedMap.has(key)) {
            groupedMap.set(key, {
              id: row.id,
              status: row.status,
              created_at: row.created_at,
              order_code: row.order_code,
              address: row.address,
              notes: row.notes,
              customer_name: row.customer_name,
              customer_email: row.customer_email,
              customer_phone: row.customer_phone,
              total_price: 0,
              items: []
            });
          }
          const order = groupedMap.get(key);
          order.total_price += row.total_price;
          order.items.push({
            name: row.product_name,
            brand: row.product_brand,
            price: row.product_price,
            quantity: row.quantity
          });
        }

        const orders = Array.from(groupedMap.values());
        let textResult = "Danh sách đơn hàng chờ xử lý/thanh toán mới nhất:\n\n";
        for (const order of orders) {
          textResult += `📦 Mã đơn: **${order.order_code || 'Chưa rõ'}**\n`;
          textResult += `- Khách hàng: ${order.customer_name} (${order.customer_phone || 'N/A'})\n`;
          textResult += `- Email: ${order.customer_email || 'N/A'}\n`;
          textResult += `- Địa chỉ: ${order.address || 'N/A'}\n`;
          textResult += `- Tổng tiền: **${order.total_price.toLocaleString('vi-VN')} đ**\n`;
          textResult += `- Sản phẩm:\n`;
          for (const item of order.items) {
            textResult += `  + [${item.brand}] ${item.name} x${item.quantity}\n`;
          }
          if (order.notes) {
            textResult += `- Ghi chú: *${order.notes}*\n`;
          }
          textResult += `- Ngày đặt: ${order.created_at}\n`;
          textResult += `-------------------------\n\n`;
        }

        log(`list_pending_orders success: listed ${orders.length} orders`);
        return {
          content: [{ type: "text", text: textResult }]
        };
      }

      if (name === "confirm_order") {
        if (!args.order_code || typeof args.order_code !== 'string') {
          throw new Error("Invalid parameter: order_code is required and must be a string");
        }
        const orderCode = args.order_code.toUpperCase();
        const paymentMethod = args.payment_method || 'bank_transfer';

        // 1. Get order details from DB
        const rawOrdersRes = await dbClient.execute({
          sql: `
            SELECT o.id, o.quantity, o.total_price, o.status, c.id as customer_id, c.name as customer_name, c.email as customer_email, 
                   p.name as product_name, p.brand as product_brand, p.price as product_price
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            JOIN products p ON o.product_id = p.id
            WHERE o.order_code = ?
          `,
          args: [orderCode]
        });

        if (rawOrdersRes.rows.length === 0) {
          log(`confirm_order: Order ${orderCode} not found.`);
          return {
            content: [{ type: "text", text: `Không tìm thấy đơn hàng nào có mã: ${orderCode}` }]
          };
        }

        const orderRows = rawOrdersRes.rows;
        const firstRow = orderRows[0];

        if (firstRow.status === 'confirmed') {
          log(`confirm_order: Order ${orderCode} was already confirmed.`);
          return {
            content: [{ type: "text", text: `Đơn hàng ${orderCode} đã được xác nhận thanh toán trước đó rồi.` }]
          };
        }

        // 2. Update status in database
        const transactionId = `MANUAL_MCP_${orderCode}_${Date.now()}`;
        const nowString = new Date().toISOString();

        await dbClient.execute({
          sql: "UPDATE orders SET status = 'confirmed', transaction_id = ?, payment_date = ?, payment_method = ? WHERE order_code = ?",
          args: [transactionId, nowString, paymentMethod, orderCode]
        });

        // 3. Send emails via Resend
        let emailSent = false;
        let emailError = null;

        if (resend && firstRow.customer_email) {
          try {
            const toEmail = firstRow.customer_email;
            const fullName = firstRow.customer_name;
            const items = orderRows.map((row) => ({
              name: row.product_name,
              brand: row.product_brand,
              quantity: row.quantity,
              price: row.product_price
            }));
            const totalPrice = orderRows.reduce((acc, row) => acc + (row.total_price || 0), 0);

            // Render html for confirmation
            const itemsHtml = items.map(item => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <strong>${item.name}</strong><br/>
                  <small style="color: #666;">Thương hiệu: ${item.brand || 'Khác'}</small>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')} đ</td>
              </tr>
            `).join('');

            const EMAIL_HEADER_HTML = `
              <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px;">
                <img src="https://summitoutdoor.io.vn/icon.svg" alt="Summit Outdoor Logo" width="50" height="50" style="display: inline-block; vertical-align: middle; border-radius: 50%;" />
                <span style="font-size: 22px; font-weight: bold; color: #111; vertical-align: middle; margin-left: 10px; letter-spacing: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">SUMMIT OUTDOOR</span>
              </div>
            `;

            // Send Order Confirmation Email
            await resend.emails.send({
              from: FROM_EMAIL,
              to: [toEmail],
              subject: `Xác nhận đơn hàng thành công #${orderCode} - Summit Outdoor`,
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                  ${EMAIL_HEADER_HTML}
                  <h2 style="color: #16a34a; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Đặt hàng thành công!</h2>
                  <p>Xin chào <strong>${fullName}</strong>,</p>
                  <p>Cảm ơn bạn đã tin tưởng mua sắm tại Summit Outdoor. Đơn hàng của bạn đã được ghi nhận thành công và đang được chuẩn bị đóng gói.</p>
                  
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> <span style="color: #c2410c; font-weight: bold;">${orderCode}</span></p>
                    <p style="margin: 5px 0;"><strong>Trạng thái thanh toán:</strong> Đã xác nhận thanh toán</p>
                  </div>
        
                  <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px;">Chi tiết sản phẩm</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #f3f4f6;">
                        <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                        <th style="padding: 10px; text-align: center; width: 80px;">SL</th>
                        <th style="padding: 10px; text-align: right; width: 120px;">Đơn giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                      <tr>
                        <td colspan="2" style="padding: 15px 10px; font-weight: bold; text-align: right;">Tổng thanh toán:</td>
                        <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #c2410c; font-size: 16px;">${totalPrice.toLocaleString('vi-VN')} đ</td>
                      </tr>
                    </tbody>
                  </table>
        
                  <p style="margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào liên quan đến đơn hàng, vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
                  <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ hệ thống Summit Outdoor. Vui lòng không phản hồi email này.</p>
                </div>
              `
            });

            // Send Thank You Email
            await resend.emails.send({
              from: FROM_EMAIL,
              to: [toEmail],
              subject: `Cảm ơn bạn đã mua hàng tại Summit Outdoor! 🏔️ (Đơn hàng #${orderCode})`,
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                  ${EMAIL_HEADER_HTML}
                  <h2 style="color: #c2410c; text-align: center; margin-bottom: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Chân thành cảm ơn bạn!</h2>
                  <p>Chào <strong>${fullName}</strong>, chúng tôi biết bạn có rất nhiều sự lựa chọn ngoài kia, cảm ơn vì đã tin tưởng đồng hành cùng <strong>Summit Outdoor</strong>.</p>
                  
                  <p>Đơn hàng của bạn với mã số <strong style="color: #c2410c;">#${orderCode}</strong> đã được bộ phận quản trị duyệt thành công và đang được chuẩn bị đóng gói cẩn thận để gửi đến bạn nhanh nhất có thể.</p>
        
                  <h3 style="color: #444; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Một số lưu ý nhỏ dành cho bạn:</h3>
                  <ul style="padding-left: 20px;">
                    <li style="margin-bottom: 10px;"><strong>Kiểm tra hàng:</strong> Khi nhận hàng, bạn vui lòng kiểm tra kỹ sản phẩm, tem mác và thử size ngay tại chỗ để đảm bảo thiết bị hoàn hảo nhất.</li>
                    <li style="margin-bottom: 10px;"><strong>Đổi size miễn phí:</strong> Đừng quên chính sách hỗ trợ đổi size miễn phí tận nhà trong vòng 7 ngày nếu giày hay quần áo của bạn bị rộng hoặc chật.</li>
                    <li style="margin-bottom: 10px;"><strong>Vệ sinh giày:</strong> Đối với giày trail, tránh phơi trực tiếp dưới ánh nắng gay gắt hoặc dùng máy sấy nóng để giữ keo đế giày luôn bền bỉ.</li>
                  </ul>
        
                  <p>Nếu bạn cần bất kỳ hỗ trợ nào về vận chuyển hoặc tư vấn kỹ thuật sử dụng sản phẩm, đừng ngần ngại chat với chatbot 24/7 của chúng tôi hoặc liên hệ trực tiếp qua số hotline hỗ trợ.</p>
                  
                  <p style="margin-top: 30px; text-align: center;">
                    <a href="https://summitoutdoor.io.vn/" style="background-color: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Ghé thăm Summit Outdoor</a>
                  </p>
        
                  <p>Chúc bạn có những chuyến đi thật trọn vẹn và an toàn!</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;"/>
                  <p style="font-size: 12px; color: #888; text-align: center;">Thân mến,<br/><strong>Đội ngũ Summit Outdoor</strong></p>
                </div>
              `
            });

            emailSent = true;
          } catch (err) {
            emailError = err.message;
            log(`confirm_order email error: ${emailError}`);
          }
        }

        log(`confirm_order success: order ${orderCode} confirmed`);
        return {
          content: [{
            type: "text",
            text: `✅ Đã duyệt thanh toán thành công cho đơn hàng: **${orderCode}**\n` +
                  `- Trạng thái DB: Cập nhật thành công sang 'confirmed'.\n` +
                  `- Gửi email xác nhận & cảm ơn qua Resend: ${emailSent ? 'Thành công' : 'Bị bỏ qua hoặc có lỗi (' + (emailError || 'Resend chưa config') + ')'}`
          }]
        };
      }

      if (name === "get_business_signals") {
        const timeWindow = args.time_window_minutes || 5;
        if (typeof timeWindow !== 'number' || timeWindow <= 0) {
          throw new Error("Invalid parameter: time_window_minutes must be a positive number");
        }

        log(`get_business_signals: querying lookback window of ${timeWindow} minutes`);

        // 1. Get new orders in lookback window (SQLite format: YYYY-MM-DD HH:mm:ss in UTC)
        const ordersRes = await dbClient.execute({
          sql: `
            SELECT o.order_code, o.total_price, o.quantity, c.name as customer_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.created_at >= datetime('now', '-' || ? || ' minutes')
            ORDER BY o.id DESC
          `,
          args: [timeWindow]
        });

        // 2. Get new leads in lookback window
        const leadsRes = await dbClient.execute({
          sql: `
            SELECT name, phone, email
            FROM customers
            WHERE created_at >= datetime('now', '-' || ? || ' minutes')
            ORDER BY id DESC
          `,
          args: [timeWindow]
        });

        // 3. Get today's summary (since start of day UTC)
        const todayOrdersRes = await dbClient.execute(`
          SELECT COUNT(DISTINCT order_code) as cnt, COALESCE(SUM(total_price), 0) as rev
          FROM orders
          WHERE created_at >= datetime('now', 'start of day')
        `);
        const todayOrders = todayOrdersRes.rows[0];

        const todayLeadsRes = await dbClient.execute(`
          SELECT COUNT(*) as cnt
          FROM customers
          WHERE created_at >= datetime('now', 'start of day')
        `);
        const todayLeads = todayLeadsRes.rows[0];

        // 4. Get 24-hour summary
        const last24hOrdersRes = await dbClient.execute(`
          SELECT COUNT(DISTINCT order_code) as cnt, COALESCE(SUM(total_price), 0) as rev
          FROM orders
          WHERE created_at >= datetime('now', '-24 hours')
        `);
        const last24hOrders = last24hOrdersRes.rows[0];

        const last24hLeadsRes = await dbClient.execute(`
          SELECT COUNT(*) as cnt
          FROM customers
          WHERE created_at >= datetime('now', '-24 hours')
        `);
        const last24hLeads = last24hLeadsRes.rows[0];

        // Format result text
        let resultText = `=== SIGNALS FOR THE LAST ${timeWindow} MINUTES ===\n`;
        
        if (ordersRes.rows.length > 0) {
          resultText += `🛒 New Orders (${ordersRes.rows.length}):\n`;
          for (const row of ordersRes.rows) {
            resultText += `- Đơn ${row.order_code}: Khách ${row.customer_name}, ${row.total_price.toLocaleString('vi-VN')} đ, ${row.quantity} sản phẩm.\n`;
          }
        } else {
          resultText += `No new orders.\n`;
        }

        resultText += `\n`;

        if (leadsRes.rows.length > 0) {
          resultText += `👤 New Leads (${leadsRes.rows.length}):\n`;
          for (const row of leadsRes.rows) {
            resultText += `- Khách ${row.name}, SĐT ${row.phone || 'N/A'}, Email ${row.email || 'N/A'}.\n`;
          }
        } else {
          resultText += `No new leads.\n`;
        }

        resultText += `\n`;
        resultText += `=== TODAY'S STATISTICS ===\n`;
        resultText += `- Total orders: ${todayOrders.cnt || 0}\n`;
        resultText += `- Total revenue: ${(Number(todayOrders.rev) || 0).toLocaleString('vi-VN')} đ\n`;
        resultText += `- Total new leads: ${todayLeads.cnt || 0}\n`;

        resultText += `\n`;
        resultText += `=== 24-HOUR SUMMARY (Morning Report) ===\n`;
        resultText += `- Orders: ${last24hOrders.cnt || 0}\n`;
        resultText += `- Revenue: ${(Number(last24hOrders.rev) || 0).toLocaleString('vi-VN')} đ\n`;
        resultText += `- New leads: ${last24hLeads.cnt || 0}\n`;

        log(`get_business_signals success: returned data for window ${timeWindow}m`);
        return {
          content: [{ type: "text", text: resultText }]
        };
      }

      throw new Error(`Tool not found: ${name}`);
    } catch (error) {
      log(`Error executing tool ${name}: ${error.message}`);
      return {
        content: [{ type: "text", text: `❌ Lỗi khi thực thi tool ${name}: ${error.message}` }],
        isError: true
      };
    }
  });

  return mcpServer;
}

// Registry to hold active transports by session ID
const transports = {};

// POST route handler
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (sessionId) {
    log(`Received POST request for session: ${sessionId}`);
  } else {
    log(`Incoming raw POST request body: ${JSON.stringify(req.body)}`);
  }

  try {
    let transport;
    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && req.body && req.body.method === 'initialize') {
      // Create a fresh transport for the new session
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          log(`Session initialized with ID: ${sid}`);
          transports[sid] = transport;
        }
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          log(`Transport closed for session ${sid}, removing from registry`);
          delete transports[sid];
        }
      };

      // Create a dedicated server instance for this session and connect it
      const server = createMcpServer();
      await server.connect(transport);
      
      // Let the transport handle the initialization request
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      log("Bad Request: missing session ID or not an initialize request");
      res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Bad Request: No valid session ID provided' },
        id: null
      });
      return;
    }

    // Handle standard tool calls using the existing session's transport
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    log(`Error handling POST request: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: `Internal server error: ${error.message}` },
        id: null
      });
    }
  }
});

// GET route handler (used to establish the SSE stream)
app.get('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] || req.query['mcp-session-id'];
  if (!sessionId || !transports[sessionId]) {
    log(`GET request failed: invalid or missing session ID (${sessionId})`);
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  log(`Establishing SSE stream for session: ${sessionId}`);
  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    log(`Error establishing SSE stream for session ${sessionId}: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).send('Error establishing SSE stream');
    }
  }
});

// DELETE route handler (used to close session)
app.delete('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] || req.query['mcp-session-id'];
  if (!sessionId || !transports[sessionId]) {
    log(`DELETE request failed: invalid or missing session ID (${sessionId})`);
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  log(`Received session termination request for session: ${sessionId}`);
  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    log(`Error terminating session ${sessionId}: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).send('Error processing session termination');
    }
  }
});

// Simple healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "healthy", server: "summit-mcp-http-server" });
});

const PORT = 3001;
// Listen on 127.0.0.1 (localhost) only as requested
app.listen(PORT, '127.0.0.1', () => {
  log(`Summit Outdoor MCP HTTP Server running on http://127.0.0.1:${PORT}/mcp`);
  log(`Database target path: ${dbPath}`);
});

// Clean up on exit
process.on('SIGINT', async () => {
  log('Shutting down server...');
  for (const sid in transports) {
    try {
      log(`Closing session transport: ${sid}`);
      await transports[sid].close();
      delete transports[sid];
    } catch (err) {
      log(`Error closing session ${sid}: ${err.message}`);
    }
  }
  process.exit(0);
});
