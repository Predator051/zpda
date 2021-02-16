const TelegramBot = require('node-telegram-bot-api');

const token = '1461737782:AAG-YX00fKSSM65n9IyF6z5XZmC754FpgaU';

const bot = new TelegramBot(token, {
    polling: true
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Леха ╮(￣_￣)╭!');

    if (msg.text && msg.text === "start sending") {
        // setInterval(() => {
        //     bot.sendMessage(msg.chat.id, "Леха-Кроха");
        // }, 1000);

    }
});