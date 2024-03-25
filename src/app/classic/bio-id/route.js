import axios from 'axios';

export async function GET(request) {
  try {
    const appId = '810323940.6.app.bioid.com';
    const appSecret = 'aqeel';
    const bcid = 'bioid/42/439877720';
    const task = 'verify';

    const encodedCredentials = Buffer.from(`${appId}:${appSecret}`).toString(
      'base64',
    );

    const axiosResponse = await axios.get(
      `https://bws.bioid.com/extension/token?id=${appId}&bcid=${bcid}&task=${task}`,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );

    // Return the response with the data received from the BioID API
    return Response.status(200).json({
      data: axiosResponse.data,
    });
  } catch (error) {
    // Handle any errors
    console.error('Error generating token:', error.message);
    return Response.status(500).json({ error: 'Internal Server Error' });
  }
}
