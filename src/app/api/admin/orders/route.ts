import { NextRequest, NextResponse } from 'next/server';
import { queryAll, queryGet, queryRun, transaction } from '@/lib/db';

export async function GET() {
  try {
    const orders = await queryAll(`
      SELECT 
        o.id, o.customer_id, o.product_id, o.quantity, o.total_price, o.status, o.created_at,
        c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
        p.brand as product_brand, p.name as product_name, p.price as product_price
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.id DESC
    `);
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
    await transaction(async (db) => {
      // 1. Insert order
      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO orders (customer_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, 'pending')`,
          [customer_id, product_id, quantity, total_price],
          function (err) {
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
          (err) => {
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

    // If status is transitioning to cancelled, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await transaction(async (db) => {
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [order.quantity, order.product_id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });
    } else {
      // Just update status (e.g. pending -> confirmed)
      await queryRun('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
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

    // Restock product if the order was deleted and not already cancelled
    if (order.status !== 'cancelled') {
      await transaction(async (db) => {
        await new Promise<void>((resolve, reject) => {
          db.run('DELETE FROM orders WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        await new Promise<void>((resolve, reject) => {
          db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [order.quantity, order.product_id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });
    } else {
      await queryRun('DELETE FROM orders WHERE id = ?', [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
