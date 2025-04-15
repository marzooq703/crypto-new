import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
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
        headers: {
          'api-key': process.env.IDFY_API_KEY,
          'account-id': process.env.IDFY_ACCOUNT_ID,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('IDfy API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to check bank verification status' },
        { status: response.status },
      );
    }

    const data = await response.json();
    const result = data[0]; // Get the first item from the array

    if (result.status === 'completed') {
      return NextResponse.json({
        success: true,
        data: {
          accountExists: result.result.account_exists,
          amountDeposited: result.result.amount_deposited,
          bankAccountNumber: result.result.bank_account_number,
          ifscCode: result.result.ifsc_code,
          nameAtBank: result.result.name_at_bank,
          status: result.result.status,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Bank verification is still in progress' },
        { status: 202 },
      );
    }
  } catch (error) {
    console.error('Bank status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
