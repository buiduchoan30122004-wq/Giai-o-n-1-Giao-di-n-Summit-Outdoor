import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryGet, queryRun, transaction } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const rawOrders = await queryAll(`
      SELECT 
        o.id, o.customer_id, o.product_id, o.quantity, o.total_price, o.status, o.created_at, o.order_code,
        o.address, o.notes, o.transaction_id, o.payment_amount, o.payment_date, o.payment_method,
        c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
        p.brand as product_brand, p.name as product_name, p.price as product_price
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.id DESC
    `);

    // Group items by order_code (or fallback to id if null)
    const groupedMap = new Map();
    for (const row of rawOrders as any[]) {
      const key = row.order_code || `ID_${row.id}`;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: row.id,
          customer_id: row.customer_id,
          status: row.status,
          created_at: row.created_at,
          order_code: row.order_code,
          address: row.address,
          notes: row.notes,
          transaction_id: row.transaction_id,
          payment_amount: row.payment_amount,
          payment_date: row.payment_date,
          payment_method: row.payment_method,
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          customer_phone: row.customer_phone,
          total_price: 0,
          quantity: 0,
          items: []
        });
      }
      const order = groupedMap.get(key);
      order.total_price += row.total_price;
      order.quantity += row.quantity;
      order.items.push({
        product_id: row.product_id,
        brand: row.product_brand,
        name: row.product_name,
        price: row.product_price,
        quantity: row.quantity
      });
    }

    const orders = Array.from(groupedMap.values());
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customer_id, product_id, quantity } = await req.json();
    if (!customer_id || !product_id || !quantity || quantity <= 0) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin đặt hàng hợp lệ' }, { status: 400 });
    }

    // Get product to check stock and price
    const product: any = await queryGet('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ success: false, error: `Không đủ tồn kho. Hiện chỉ còn ${product.stock} sản phẩm.` }, { status: 400 });
    }

    const total_price = product.price * quantity;

    let orderId = 0;
    // Execute inside a database transaction to ensure data integrity
    await transaction(async (db: any) => {
      // 1. Insert order
      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO orders (customer_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, 'pending')`,
          [customer_id, product_id, quantity, total_price],
          function (this: any, err: any) {
            if (err) reject(err);
            else {
              orderId = this.lastID;
              resolve();
            }
          }
        );
      });

      // 2. Deduct stock
      await new Promise<void>((resolve, reject) => {
        db.run(
          `UPDATE products SET stock = stock - ? WHERE id = ?`,
          [quantity, product_id],
          (err: any) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    return NextResponse.json({ success: true, id: orderId, total_price });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu ID đơn hàng hoặc trạng thái mới' }, { status: 400 });
    }

    // Get order to see current status
    const order: any = await queryGet('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    // If status is transitioning to cancelled, restore stock for all items in the order group
    if (status === 'cancelled' && order.status !== 'cancelled') {
      const items = order.order_code
        ? await queryAll('SELECT * FROM orders WHERE order_code = ?', [order.order_code])
        : [order];

      await transaction(async (db: any) => {
        for (const item of items as any[]) {
          await new Promise<void>((resolve, reject) => {
            db.run('UPDATE orders SET status = ? WHERE id = ?', [status, item.id], (err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });
          if (item.status !== 'cancelled') {
            await new Promise<void>((resolve, reject) => {
              db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id], (err: any) => {
                if (err) reject(err);
                else resolve();
              });
            });
          }
        }
      });
    } else {
      // Just update status for all items in the order group
      if (order.order_code) {
        await queryRun('UPDATE orders SET status = ? WHERE order_code = ?', [status, order.order_code]);
        if (status === 'confirmed') {
          try {
            const groupOrders = await queryAll('SELECT * FROM orders WHERE order_code = ?', [order.order_code]);
            const total = groupOrders.reduce((acc: number, o: any) => acc + (o.total_price || 0), 0);
            const paymentsFilePath = path.join(process.cwd(), 'src/data/payments.json');
            const dirPath = path.dirname(paymentsFilePath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            let payments: any = {};
            if (fs.existsSync(paymentsFilePath)) {
              payments = JSON.parse(fs.readFileSync(paymentsFilePath, 'utf-8'));
            }
            payments[order.order_code] = {
              paid: true,
              transactionId: `MANUAL_${order.id}_${Date.now()}`,
              amount: total,
              date: new Date().toISOString(),
              processedAt: new Date().toISOString()
            };
            fs.writeFileSync(paymentsFilePath, JSON.stringify(payments, null, 2), 'utf-8');
          } catch (err) {
            console.error('Failed to sync manual confirm with payments.json:', err);
          }
        }
      } else {
        await queryRun('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        if (status === 'confirmed') {
          try {
            const paymentsFilePath = path.join(process.cwd(), 'src/data/payments.json');
            const dirPath = path.dirname(paymentsFilePath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            let payments: any = {};
            if (fs.existsSync(paymentsFilePath)) {
              payments = JSON.parse(fs.readFileSync(paymentsFilePath, 'utf-8'));
            }
            const key = `SUMMIT_MANUAL_${order.id}`;
            payments[key] = {
              paid: true,
              transactionId: `MANUAL_${order.id}_${Date.now()}`,
              amount: order.total_price || 0,
              date: new Date().toISOString(),
              processedAt: new Date().toISOString()
            };
            fs.writeFileSync(paymentsFilePath, JSON.stringify(payments, null, 2), 'utf-8');
          } catch (err) {
            console.error('Failed to sync manual confirm with payments.json:', err);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID đơn hàng' }, { status: 400 });
    }

    const order: any = await queryGet('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại' }, { status: 404 });
    }

    const items = order.order_code
      ? await queryAll('SELECT * FROM orders WHERE order_code = ?', [order.order_code])
      : [order];

    // Restock products for all items in the order group if they were not already cancelled
    await transaction(async (db: any) => {
      for (const item of items as any[]) {
        await new Promise<void>((resolve, reject) => {
          db.run('DELETE FROM orders WHERE id = ?', [item.id], (err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
        if (item.status !== 'cancelled') {
          await new Promise<void>((resolve, reject) => {
            db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id], (err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
