import "reflect-metadata";
import { User } from "./entity/users";
import { createConnection, getMongoManager } from "typeorm";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import cheerio from "cheerio";
import { Post } from "./entity/posts";
import fs from "fs";

createConnection("default").then(async () => {
	const token = "1461737782:AAG-YX00fKSSM65n9IyF6z5XZmC754FpgaU";
	const url = `https://www.president.gov.ua/documents/decrees`;

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

	const bot = new TelegramBot(token, {
		polling: true,
	});
	const manager = getMongoManager();

	const parseFunc = (html: string) => {
		const $ = cheerio.load(html);
		$("div#res").each(function (_, element) {
			$("div.doc_item", element).each(async (_, postHtml) => {
				const postText = $("div.doc_text p", postHtml).text().trim();

				const postDate = $("p.doc_date", postHtml).text().trim();

				const postTitle = $("h3 a", postHtml).text().trim();

				const foundPost = await manager.findOne(Post, { title: postTitle });

				if (foundPost === undefined) {
					const newPost = new Post();
					newPost.date = postDate;
					newPost.text = postText;
					newPost.title = postTitle;

					await manager.save(newPost);

					for (const keyWord of keyWords) {
						if (postText.toLowerCase().indexOf(keyWord, 0) < 0) {
							const allUsers = await manager.find(User, {});

							for (const user of allUsers) {
								await bot.sendMessage(
									user.chatId,
									`Вышел новый указ: \n${newPost.title} \n${postDate} \n${postText}`
								);
							}
						}
					}
				}
			});
		});
	};

	const lastPostFunc = async (chatId: number) => {
		const allPosts = await manager.find(Post);

		let lastNumber = 0;
		//УКАЗ ПРЕЗИДЕНТА УКРАЇНИ №55/2021
		let lastExistedPost: Post;
		for (const post of allPosts) {
			const numberPart = parseInt(
				post.title.substring(
					post.title.indexOf("№") + 1,
					post.title.indexOf("/")
				)
			);
			if (lastNumber < numberPart) {
				lastNumber = numberPart;
				lastExistedPost = post;
			}
		}

		await bot.sendMessage(
			chatId,
			`Последний указ: \n${lastExistedPost.title} \n${lastExistedPost.date} \n${lastExistedPost.text}`
		);
	};

	bot.on("message", async (msg) => {
		const chatId = msg.chat.id;

		if (msg.text && msg.text === "/start") {
			const user = await manager.find(User, { chatId: chatId });

			if (user === undefined) {
				const newUser = new User();
				newUser.chatId = msg.chat.id;

				const saved = await manager.save(newUser);

				if (saved) {
					bot.sendMessage(
						chatId,
						"Алексей, сын Алексея, из дома Алексеева, приветствует тебя, stranger!",
						{
							reply_markup: {
								inline_keyboard: [
									[{ text: "Последний приказ", callback_data: "last_post" }],
								],
							},
						}
					);
				}
			}

			bot.sendMessage(
				chatId,
				"Алексей, сын Алексея, из дома Алексеева, приветствует тебя, stranger!",
				{
					reply_markup: {
						inline_keyboard: [
							[{ text: "Последний приказ", callback_data: "last_post" }],
						],
					},
				}
			);
		}

		if (msg.text && msg.text === "/last_post") {
			await lastPostFunc(chatId);
		}

		// if (msg.text && msg.text === "/dukalos") {
		// 	const buffer = fs.readFileSync(__dirname + "/dakalo.jpg");
		// 	bot.sendPhoto(chatId, buffer);
		// }
	});

	bot.on("callback_query", async (msg) => {
		const chatId = msg.message.chat.id;
		await lastPostFunc(chatId);
	});

	setInterval(() => {
		axios.get(url).then((response) => {
			parseFunc(response.data);
		});
	}, 5000);
});
