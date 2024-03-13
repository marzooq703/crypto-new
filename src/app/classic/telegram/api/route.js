var axios = require('axios').default;

const sendMessageToGroup = async (groupChatId, message) => {
  try {
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(
      '7035310993:AAGnSwYQ5NOuK22q7Z4c6NoTauZ2w6O99q0',
      { polling: true },
    );

    await bot.sendMessage(groupChatId, message);
    console.log('Message sent successfully to group');
    return 'Message sent successfully to group';
  } catch (error) {
    console.error('Error sending message to group:', error);
    return 'error';
  }
};

export async function GET(request) {
  try {
    // const response = await axios.request(options);
    // console.log('telegram request initiated:', response.data);

    // Send message to group via Telegram after KYC request is made
    const groupChatId = '-4140541763'; // Replace with your group chat ID
    const message = 'telegram request has been initiated.';
    const finalResp = await sendMessageToGroup(groupChatId, message);

    return Response.json({ data: finalResp });
  } catch (error) {
    console.error('Error initiating telegram request:', error);
    return Response.error({ message: error.message });
  }
  //   return Response.json({ name: 'tariq' });
}
