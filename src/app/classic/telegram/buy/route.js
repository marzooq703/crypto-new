// var axios = require('axios').default;

// const TelegramBot = require('node-telegram-bot-api');
// const bot = new TelegramBot('7035310993:AAGnSwYQ5NOuK22q7Z4c6NoTauZ2w6O99q0', {
//   polling: true,
// });
// const sendMessageToGroup = async (groupChatId, message) => {
//   try {
//     await bot.sendMessage(groupChatId, message);
//     console.log('Message sent successfully to group');
//     return 'Message sent successfully to group';
//   } catch (error) {
//     console.error('Error sending message to group:', error);
//     return 'error';
//   }
// };

// export async function POST(request) {
//   try {
//     const data = await request.json();
//     console.log(data);
//     const { type, amount, userName, userID, city } = data;

//     // Send message to group via Telegram after KYC request is made
//     const groupChatId = '-4169590277'; // Replace with your group chat ID
//     const message = `${type} request has been raised for the amount of ${amount} for ${userName}[${userID}] from ${city}`;
//     const finalResp = await sendMessageToGroup(groupChatId, message);

//     return Response.json({ data: finalResp });
//   } catch (error) {
//     console.error('Error initiating telegram request:', error);
//     return Response.error({ message: error.message });
//   }
//   //   return Response.json({ name: 'tariq' });
// }
