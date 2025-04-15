import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { panNumber, fullName, dob } = await request.json();

    // Validate PAN number format
    if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return NextResponse.json(
        { error: 'Invalid PAN number format' },
        { status: 400 },
      );
    }

    // Validate full name
    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 },
      );
    }

    // Validate date of birth
    if (!dob) {
      return NextResponse.json(
        { error: 'Date of birth is required' },
        { status: 400 },
      );
    }

    // Check if environment variables are set
    if (!process.env.IDFY_API_KEY || !process.env.IDFY_ACCOUNT_ID) {
      console.error('Missing IDfy API credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    // Make request to IDfy API
    const response = await fetch(
      'https://eve.idfy.com/v3/tasks/async/verify_with_source/ind_pan',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.IDFY_API_KEY,
          'account-id': process.env.IDFY_ACCOUNT_ID,
        },
        body: JSON.stringify({
          task_id: `pan_${Date.now()}`,
          group_id: `group_${Date.now()}`,
          data: {
            id_number: panNumber,
            input_details: {
              input_pan_number: panNumber,
              input_name: fullName,
              input_dob: dob,
            },
          },
        }),
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('IDfy API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });
      return NextResponse.json(
        {
          error: responseData.message || 'PAN verification failed',
          details: responseData,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('PAN verification error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        error: 'Failed to verify PAN',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
