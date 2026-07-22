import { NextRequest, NextResponse } from 'next/server';
import { queryGet, queryRun } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, address, notes, paymentMethod, orderCode, cartItems } = await req.json();

    if (!name || !phone || !email || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin đặt hàng bắt buộc' }, { status: 400 });
    }

    let customerId = 0;

    // 1. Find or create customer in brain.db
    const existingCustomer: any = await queryGet('SELECT id FROM customers WHERE email = ?', [email]);
    if (existingCustomer) {
      customerId = existingCustomer.id;
      await queryRun('UPDATE customers SET name = ?, phone = ? WHERE id = ?', [name, phone, customerId]);
    } else {
      const result = await queryRun(
        'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone]
      );
      customerId = result.lastID;
    }

    // 2. Loop through cart items and record orders
    for (const item of cartItems) {
      const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/\./g, '').replace('đ', '')) || 0;
      };

      const itemPrice = parsePrice(item.price);
      let dbProductId = 0;

      // Find product in SQLite database by brand and name (case insensitive)
      const existingProduct: any = await queryGet(
        'SELECT id FROM products WHERE LOWER(name) = LOWER(?) AND LOWER(brand) = LOWER(?)',
        [item.name, item.brand]
      );

      if (existingProduct) {
        dbProductId = existingProduct.id;
      } else {
        // Automatically register the product in the SQLite database if it doesn't exist
        const result = await queryRun(
          'INSERT INTO products (brand, name, price, image_url, description, stock) VALUES (?, ?, ?, ?, ?, ?)',
          [item.brand, item.name, itemPrice, item.image || '', '', 100]
        );
        dbProductId = result.lastID;
      }

      const totalItemPrice = itemPrice * item.quantity;
      const initialStatus = 'pending';

      // 3. Save order record with order_code
      await queryRun(
        'INSERT INTO orders (customer_id, product_id, quantity, total_price, status, order_code) VALUES (?, ?, ?, ?, ?, ?)',
        [customerId, dbProductId, item.quantity, totalItemPrice, initialStatus, orderCode]
      );

      // 4. Deduct stock in DB
      await queryRun(
        'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
        [item.quantity, dbProductId]
      );
    }

    return NextResponse.json({ success: true, orderCode });

  } catch (error: any) {
    console.error('Error placing order in CRM:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
