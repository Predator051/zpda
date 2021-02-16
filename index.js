const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");

const token = "1461737782:AAG-YX00fKSSM65n9IyF6z5XZmC754FpgaU";
const url = `https://www.president.gov.ua/documents/decrees`;

const bot = new TelegramBot(token, {
	polling: true,
});

const keyWords = [
	"склад",
	"демобілізація",
	"демобілізації",
	"демобілізації",
	"демобілізацію",
	"демобілізацією",
	"демобілізації",
	"запас",
	"запасу",
	"запасу",
	"запас",
	"запасом",
	"запасі",
	"строкової",
	"строкову",
	"призовів",
	"звільнення",
];

bot.on("message", (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, "Леха ╮(￣_￣)╭!");

	if (msg.text && msg.text === "start sending") {
		setInterval(() => {
			axios.get(url).then((response) => {
				for (const keyWord of keyWords) {
					if (response.data.toLowerCase().indexOf(keyWord, 0) >= 0) {
						console.log("Finds", keyWord);
					}
				}
			});
		}, 1000);
	}
});
