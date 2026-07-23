import { NextRequest, NextResponse } from 'next/server';
import { queryGet, queryRun } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name || body.fullName || '';
    const email = body.email || '';
    const phone = body.phone || '';
    const preferred_brand = body.preferred_brand || body.favoriteBrand || '';
    const experience_level = body.experience_level || body.experienceLevel || '';
    const interests = body.interests || '';
    
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Thiếu tên hoặc email khách hàng' }, { status: 400 });
    }

    // Check if customer email already exists
    const existing: any = await queryGet('SELECT id, interests FROM customers WHERE email = ?', [email]);
    
    if (existing) {
      // Append new interests if not already present
      let updatedInterests = existing.interests || '';
      if (interests) {
        if (updatedInterests && !updatedInterests.includes(interests)) {
          updatedInterests = `${updatedInterests} | ${interests}`;
        } else if (!updatedInterests) {
          updatedInterests = interests;
        }
      }

      // Update existing customer info
      await queryRun(
        `UPDATE customers SET name = ?, phone = ?, preferred_brand = ?, experience_level = ?, interests = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [
          name,
          phone || '',
          preferred_brand || '',
          experience_level || '',
          updatedInterests,
          existing.id
        ]
      );
    } else {
      // Insert new subscriber
      await queryRun(
        `INSERT INTO customers (name, email, phone, preferred_brand, experience_level, interests) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          phone || '',
          preferred_brand || '',
          experience_level || '',
          interests || ''
        ]
      );
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Subscribe API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
