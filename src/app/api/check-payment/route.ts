import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const paymentsFilePath = path.join(process.cwd(), 'src/data/payments.json');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get('orderCode')?.toUpperCase();

    if (!orderCode) {
      return NextResponse.json(
        { success: false, message: 'Missing orderCode query parameter' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(paymentsFilePath)) {
      return NextResponse.json({ paid: false });
    }

    const fileContent = fs.readFileSync(paymentsFilePath, 'utf-8');
    const payments = JSON.parse(fileContent);

    if (payments[orderCode] && payments[orderCode].paid) {
      return NextResponse.json({
        paid: true,
        transactionId: payments[orderCode].transactionId,
        amount: payments[orderCode].amount,
        date: payments[orderCode].date
      });
    }

    return NextResponse.json({ paid: false });

  } catch (error: any) {
    console.error('Error checking payment:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking payment status' },
      { status: 500 }
    );
  }
}
