import { Cashfree } from 'cashfree-pg';
var axios = require('axios').default;

Cashfree.XClientId = process.env.XClientId;
Cashfree.XClientSecret = process.env.XClientSecret;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

console.log(process.env.XClientId);
function generateOrderId(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { amount, name, email, phone } = data;
    const id = `order_${generateOrderId(5)}`;

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: id,
      customer_details: {
        customer_id: id,
        customer_phone: phone,
        customer_name: name,
        customer_email: email,
      },
      order_meta: {
        return_url: `https://stablecrypto.in/classic/payment-confirmation?orderid=${id}`,
      },
    };

    const response = await Cashfree.PGCreateOrder('2023-08-01', request);

    console.log(
      'Order created successfully:',
      response.data.payment_session_id,
    );
    //   res.status(200).json(response.data);
    return Response.json({ response: response.data });
  } catch (error) {
    console.error('Error:', error.response.data.message);
    //   res.status(error.response.status).json({ error: error.response.data.message });
    return Response.json({ error: error.response.data.message });
  }

  return Response.json({ name: 'res' });
  //test
}
