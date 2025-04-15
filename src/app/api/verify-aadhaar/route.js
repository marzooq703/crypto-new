import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { aadhaarNumber } = await req.json();

    const response = await fetch(
      'https://eve.idfy.com/v3/tasks/async/verify_with_source/aadhaar_lite',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.IDFY_API_KEY,
          'account-id': process.env.IDFY_ACCOUNT_ID,
        },
        body: JSON.stringify({
          task_id: crypto.randomUUID(),
          group_id: crypto.randomUUID(),
          data: {
            aadhaar_number: aadhaarNumber,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Aadhaar verification failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Aadhaar verification failed' },
      { status: 500 },
    );
  }
}
