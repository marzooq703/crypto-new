import { NextResponse } from 'next/server';

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

    // Make request to IDfy API
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
      const errorData = await response.json();
      console.error('IDfy API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to check PAN status' },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Format the response to match the expected structure
    const formattedResponse = {
      request_id: data.request_id,
      status: data.status,
      result: {
        source_output: {
          aadhaar_seeeding_status:
            data.result?.source_output?.aadhaar_seeeding_status || false,
          pan_status: data.result?.source_output?.pan_status || 'unknown',
          name_match: data.result?.source_output?.name_match || false,
          dob_match: data.result?.source_output?.dob_match || false,
        },
        input_details: {
          input_pan_number: data.result?.input_details?.input_pan_number || '',
          input_name: data.result?.input_details?.input_name || '',
          input_dob: data.result?.input_details?.input_dob || '',
        },
      },
    };

    return NextResponse.json([formattedResponse]);
  } catch (error) {
    console.error('PAN status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check PAN status' },
      { status: 500 },
    );
  }
}
