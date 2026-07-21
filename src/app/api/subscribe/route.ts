import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // WARNING: Replace this URL with your actual Google Apps Script Web App URL
    // You will get this URL after following the setup instructions for Google Sheets
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzPKq7oWAuMOA2DujKp3_crxnaaJrw7Ul3XMqQwmtHsU8LVeakvcSj7FDGsPHXF5iPDaw/exec';

    if (!GOOGLE_SCRIPT_URL) {
        console.warn("Google Sheets Webhook URL is not configured. Data won't be saved to Sheets.");
        // In production without a webhook, we just return success to not block the user flow
        return NextResponse.json({ success: true, message: 'Simulated success (No webhook configured)' });
    }

    // Try to send data to Google Sheets
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            // Google Apps Script requires no-cors or simple form url encoded often, 
            // but fetching a POST from Next.js server to Google Script usually works fine.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error('Google Script responded with error:', response.status);
            // We still return success to frontend to show the discount code
        }
    } catch (fetchError) {
        console.error('Failed to fetch Google Script:', fetchError);
        // We still return success to frontend to show the discount code
    }

    // Always return success to the user so they get their discount code
    // even if the background save to Google Sheets has issues.
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
