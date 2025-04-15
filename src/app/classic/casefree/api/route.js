import { Cashfree } from 'cashfree-pg';

Cashfree.XClientId = '496275d72b66247ade662722d8572694';
Cashfree.XClientSecret =
  'cfsk_ma_prod_b929de6e5efcebffd5477a813580e6bf_7c2169e7';
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

function generateOrderId(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Handler for the POST method
export async function POST(request) {
  try {
    const amount = req.body.amount;
    const customerName = req.body.customerName;
    const customerEmail = req.body.customerEmail;
    const customerPhone = req.body.customerPhone;

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: `order_${generateOrderId(5)}`,
      customer_details: {
        customer_id: customerName,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: 'https://app.zuthod.com/payment?success=true',
      },
    };

    const response = await Cashfree.PGCreateOrder('2023-08-01', request);

    console.log('Order created successfully:', response.data);
    //   res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response.data.message);
    //   res.status(error.response.status).json({ error: error.response.data.message });
  }
}

// Export the handler function
