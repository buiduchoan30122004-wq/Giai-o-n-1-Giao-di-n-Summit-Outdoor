import { NextResponse } from 'next/server';
import { queryGet, queryRun, queryAll } from '@/lib/db';

export async function GET() {
  const diagnostics: any = {};
  try {
    // 1. Thử ghi chép giống place-order
    const customer = await queryRun(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      ['Test User', 'test@example.com', '0900000000']
    );
    diagnostics.customerWrite = customer;

    // Lấy id sản phẩm đầu tiên có trong bảng products
    const product: any = await queryGet('SELECT id FROM products LIMIT 1');
    const productId = product ? product.id : 1;

    const order = await queryRun(
      'INSERT INTO orders (customer_id, product_id, quantity, total_price, status, order_code) VALUES (?, ?, ?, ?, ?, ?)',
      [customer.lastID, productId, 1, 1000, 'pending', 'TESTORDER123']
    );
    diagnostics.orderWrite = order;
  } catch (error: any) {
    diagnostics.error = {
      message: error.message,
      stack: error.stack
    };
  }
  return NextResponse.json(diagnostics);
}
