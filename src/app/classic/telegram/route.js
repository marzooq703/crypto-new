var axios = require('axios').default;

const sendMessageToGroup = async (groupChatId, message) => {
  try {
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

    await bot.sendMessage(groupChatId, message);
    console.log('Message sent successfully to group');
  } catch (error) {
    console.error('Error sending message to group:', error);
  }
};

export async function GET(request) {
  const options = {
    method: 'post',
    url: 'https://dg-sandbox.setu.co/api/okyc',
    headers: {
      'x-client-id': 'bfa20161-1440-4cf9-807f-bb5eb96a4d8a',
      'x-client-secret': 'fQ9bex8f2Ttqb6Mox3w2qQe6VUITQlIV',
      'x-product-instance-id': 'f3d073fe-bec8-4739-9b75-f650cc406a8d',
    },
    data: {
      redirectURL: 'http://localhost:3000/classic/telegram',
    },
  };

  try {
    const response = await axios.request(options);
    console.log('telegram request initiated:', response.data);

    // Send message to group via Telegram after KYC request is made
    // const groupChatId = '-4140541763'; // Replace with your group chat ID
    const message = 'telegram request has been initiated.';
    await sendMessageToGroup(groupChatId, message);

    return Response.json({ data: response.data });
  } catch (error) {
    console.error('Error initiating telegram request:', error);
    return Response.error({ message: error.message });
  }
}
// var axios = require('axios').default;

// export async function GET(request) {
//   var options = {
//     method: 'post',
//     url: 'https://dg-sandbox.setu.co/api/okyc',
//     headers: {
//       'x-client-id': 'bfa20161-1440-4cf9-807f-bb5eb96a4d8a',
//       'x-client-secret': 'fQ9bex8f2Ttqb6Mox3w2qQe6VUITQlIV',
//       'x-product-instance-id': 'f3d073fe-bec8-4739-9b75-f650cc406a8d',
//     },
//     data: {
//       redirectURL: 'http://localhost:3000/classic/kyc',
//     },
//   };
//   let res = await axios
//     .request(options)
//     .then(function (response) {
//       console.log(response.data);
//       return response.data;
//     })
//     .catch(function (error) {
//       console.error(error);
//       return error;
//     });

//   return Response.json({ res });
// }
