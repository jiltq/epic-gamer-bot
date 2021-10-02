const { Book, Page, Button, Menu } = require('../bookHelper.js');
const Discord = require('discord.js');

module.exports = {
	name: 'booktest',
	description: 'e',
	category: 'dev',
	async execute(message, args, IPM) {
		const embed1 = new Discord.MessageEmbed()
			.setTitle('gay');
		const embed2 = new Discord.MessageEmbed()
			.setTitle('not gay');
		const button1 = new Button(async (book, i) => await book.turn2Page(1, i), { label: 'yo mama', style: 'DANGER' });
		const button2 = new Button(async (book, i) => await book.turn2Page(0, i), { label: 'yo dad' });
		const menu1 = new Menu(async (book, i) => console.log('shrek'), { placeholder: 'Placeholder', options: [
			{
				label: 'Select me',
				description: 'This is a description',
				value: 'first_option',
			},
			{
				label: 'You can select me too',
				description: 'This is also a description',
				value: 'second_option',
			},
		] });
		const page1 = new Page({ embed: embed1, components: [button1] });
		const page2 = new Page({ embed: embed2, components: [button2] });
		const book1 = new Book({ pages: [page1, page2] });
		book1.init(message.client, message.channel.id, message.author.id);
	},
};