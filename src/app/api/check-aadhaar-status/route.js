import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('request_id');

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://eve.idfy.com/v3/tasks?request_id=${requestId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.IDFY_API_KEY,
          'account-id': process.env.IDFY_ACCOUNT_ID,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Aadhaar verification status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Aadhaar status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check Aadhaar status' },
      { status: 500 },
    );
  }
}
