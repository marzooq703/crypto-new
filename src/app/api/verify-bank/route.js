import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { bankAccountNumber, bankIfscCode } = await request.json();

    if (!bankAccountNumber || !bankIfscCode) {
      return NextResponse.json(
        { error: 'Bank account number and IFSC code are required' },
        { status: 400 },
      );
    }

    const response = await fetch(
      'https://eve.idfy.com/v3/tasks/async/verify_with_source/validate_bank_account',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.IDFY_API_KEY,
          'account-id': process.env.IDFY_ACCOUNT_ID,
        },
        body: JSON.stringify({
          task_id: '123',
          group_id: '1234',
          data: {
            bank_account_no: bankAccountNumber,
            bank_ifsc_code: bankIfscCode,
            nf_verification: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('IDfy API Error:', errorData);
      return NextResponse.json(
        { error: 'Bank verification failed' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ request_id: data.request_id });
  } catch (error) {
    console.error('Bank verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
