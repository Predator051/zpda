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
];

const rememberedPosts = [];

const parseFunc = (html) => {
	const $ = cheerio.load(html);
	$("div#res").each(function (_, element) {
		$("div.doc_item", element).each((_, postHtml) => {
			// console.log("AAAAAAAAAAAA", $(postHtml).html());
			const postText = $("div.doc_text p", postHtml).text();

			const postDate = $("p.doc_date", postHtml).text();

			const postTitle = $("h3 a", postHtml).text();

			if (rememberedPosts.findIndex((rp) => rp.title === postTitle) < 0) {
				rememberedPosts.push({
					title: postTitle,
					date: postDate,
					text: postText,
				});

				for (const keyWord of keyWords) {
					if (postText.toLowerCase().indexOf(keyWord, 0) >= 0) {
					}
				}
			}
		});
	});
};

bot.on("message", (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, "Леха ╮(￣_￣)╭!");

	if (msg.text && msg.text === "start sending") {
		// setInterval(() => {
		axios.get(url).then((response) => {
			parseFunc(response.data);
			for (const keyWord of keyWords) {
			}
		});
		// }, 1000);
	}
});
