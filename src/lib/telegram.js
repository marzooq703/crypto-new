const TelegramBot = require('node-telegram-bot-api');

// Initialize your Telegram Bot with the API token obtained from BotFather
const bot = new TelegramBot('YOUR_TELEGRAM_BOT_TOKEN', { polling: true });

// Define a function to send a message to a user
const sendMessageToUser = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message);
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Define a function to redirect a user to a Telegram group
function redirectToGroup(chatId, groupLink) {
  bot.sendMessage(chatId, `Join our Telegram group: ${groupLink}`);
}

module.exports = { sendMessageToUser, redirectToGroup };
