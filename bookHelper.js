const Discord = require('discord.js');

function makeRandom(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const defaultButtons = [
	{
		callback: async function(book, i) {
			await book.backPage(i);
		},
		actualThing: new Discord.MessageButton()
			.setLabel('<')
			.setStyle('PRIMARY')
			.setCustomId(makeRandom(10)),
	},
	{
		callback: async function(book, i) {
			await book.nextPage(i);
		},
		actualThing: new Discord.MessageButton()
			.setLabel('>')
			.setStyle('PRIMARY')
			.setCustomId(makeRandom(10)),
	},
];

module.exports = {
	Menu: class Menu {
		constructor(callback, { placeholder, options }) {
			this.callback = callback;
			const msgMenu = new Discord.MessageSelectMenu()
				.setCustomId(makeRandom(10))
				.setPlaceholder(placeholder)
				.addOptions(options);
			return {
				callback: callback,
				actualThing: msgMenu,
			};
		}
	},
	Button: class Button {
		constructor(callback, { label, style = 'PRIMARY', emoji = null }) {
			this.callback = callback;
			const discButton = new Discord.MessageButton()
				.setLabel(label)
				.setStyle(style)
				.setEmoji(emoji)
				.setCustomId(makeRandom(10));
			return {
				callback: callback,
				actualThing: discButton,
			};
		}
	},
	Page: class Page {
		constructor({ components, embed, includeDefault = false, name }) {
			let newComponents = components;
			const row = new Discord.MessageActionRow();
			if (includeDefault) {
				row.addComponents(defaultButtons.map(button => button.actualThing)[0]);
			}
			row.addComponents(...components.map(component => component.actualThing));
			if (includeDefault) {
				row.addComponents(defaultButtons.map(button => button.actualThing)[1]);
				newComponents = [...components, ...defaultButtons];
			}
			return {
				msgOptions: {
					embeds: [embed],
					components: [row],
				},
				componentData: newComponents,
			};
		}
	},
	Book: class Book {
		constructor(options) {
			const { pages } = options;
			this.pages = pages;
		}
		async init(client, channelId, userId) {
			this.currentPage = 0;
			const channel = await client.channels.fetch(channelId);
			this.newMsg = await channel.send(this.pages[0].msgOptions);
			const filter = i => i.user.id == userId;

			const collector = channel.createMessageComponentCollector({ filter, time: 15000 });

			collector.on('collect', async i => {
				let goOn = true;
				this.pages.forEach(async page =>{
					if (goOn) {
						const component = page.componentData.find($component => $component.actualThing.customId == i.customId);
						if (component) {
							await component.callback(this, i);
							goOn = false;
						}
					}
				});
			});
		}
		async turn2Page(pageIndex, i) {
			await i.update(this.pages[pageIndex].msgOptions);
			this.currentPage = pageIndex;
		}
		async nextPage(i) {
			if (this.pages.length > this.currentPage + 1) {
				await i.update(this.pages[this.currentPage + 1].msgOptions);
				this.currentPage = this.currentPage + 1;
			}
		}
		async backPage(i) {
			if (this.currentPage - 1 >= 0) {
				await i.update(this.pages[this.currentPage - 1].msgOptions);
				this.currentPage = this.currentPage - 1;
			}
		}
	},
};