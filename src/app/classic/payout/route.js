import axios from 'axios';

// Handler for the POST method
export async function POST(request) {
  try {
    const headers = {
      'x-api-version': '2024-01-01',
      'X-Client-Id': 'CF496275COPO0S465OL5NF3SJV30',
      'x-client-secret':
        'cfsk_ma_prod_caf84dae9dbae8872ec8e0567b6814b9_e869f789',
    };

    const data = await request.json();
    const { transfers, batch_transfer_id } = data;

    const payload = {
      transfers: transfers.map((transfer) => ({
        beneficiary_details: {
          beneficiary_id: transfer.beneficiary_id,
          beneficiary_name: transfer.beneficiary_name,
        },
        transfer_id: transfer.transfer_id,
        transfer_amount: transfer.transfer_amount,
        transfer_currency: transfer.transfer_currency,
        transfer_mode: transfer.transfer_mode,
      })),
      batch_transfer_id: batch_transfer_id,
    };

    const response = await axios.post(
      'https://api.cashfree.com/payout/transfers/batch',
      payload,
      { headers },
    );

    return {
      status: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error:', error.response.data);
    return {
      status: 500,
      body: JSON.stringify({
        error: 'An error occurred while processing the request.',
      }),
    };
  }
}

// Export the handler function
