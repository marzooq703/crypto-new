var axios = require('axios').default;

export async function GET(request) {
  var options = {
    method: 'post',
    url: 'https://dg-sandbox.setu.co/api/okyc',
    headers: {
      'x-client-id': 'bfa20161-1440-4cf9-807f-bb5eb96a4d8a',
      'x-client-secret': 'fQ9bex8f2Ttqb6Mox3w2qQe6VUITQlIV',
      'x-product-instance-id': 'f3d073fe-bec8-4739-9b75-f650cc406a8d',
    },
    data: {
      redirectURL: 'https://www.stablecrypto.in/',
    },
  };
  let res = await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      return error;
    });

  return Response.json({ res });
}
