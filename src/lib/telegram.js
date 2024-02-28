const TelegramBot = require('node-telegram-bot-api');

// Initialize your Telegram Bot with the API token obtained from BotFather
const bot = new TelegramBot('7035310993:AAGnSwYQ5NOuK22q7Z4c6NoTauZ2w6O99q0', {
  polling: true,
}); // bot token should be added.

// Define a function to send a message to a user
const sendMessageToUser = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// // Define a function to redirect a user to a Telegram group
function redirectToGroup(chatId, groupLink) {
  bot.sendMessage(chatId, `Join our Telegram group: ${groupLink}`);
}

const sendMessageToGroup = async (groupChatId, message) => {
  try {
    await bot.sendMessage(groupChatId, message);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

module.exports = { sendMessageToUser, redirectToGroup, sendMessageToGroup };
