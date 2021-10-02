const Discord = require('discord.js');
const { Book, Page, Button, Menu } = require('../bookHelper.js');
module.exports = {
	name: 'cosmetics',
	description: 'Adjust your cosmetics',
	category: 'fun',
	args: false,
	async execute(message, args, IPM) {
		const colorRoles = message.guild.roles.cache.filter(role => role.name.startsWith('color_'));
		const homeEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Cosmetics`)
			.setThumbnail(`${message.author.avatarURL()}`);
		const nameColorEmbed = new Discord.MessageEmbed()
			.setTitle(`Your current name color: ${message.member.roles.highest.name.slice('color_'.length)}`)
			.setColor(message.member.roles.highest.name.slice('color_'.length).toUpperCase());
		const nameColorButton = new Button(async (book, i) => book.turn2Page(1, i), { label: 'Name Color' });
		const colorMenu = new Menu(async (book, i) => console.log('shrek'), { placeholder: 'Choose your name color', options: colorRoles.map(role => {
			return {
				label: role.name.substr('color_'.length),
				value: role.name,
			};
		}) });
		const homeButton = new Button(async (book, i) => book.turn2Page(0, i), { label: '< Back' });
		const homePage = new Page({ embed: homeEmbed, components: [nameColorButton], includeDefault: false });
		const nameColorPage = new Page({ embed: nameColorEmbed, components: [homeButton], includeDefault: false });
		const cosmeticsBook = new Book({ pages: [homePage, nameColorPage] });
		cosmeticsBook.init(message.client, message.channel.id, message.author.id);
		return;
		const $message = message.reply({ embeds: [embed1], components: [row1], allowedMentions: { repliedUser: false } });
		const filter = i => (i.customId.startsWith(message.id) && i.user.id == message.author.id);
		const collector = message.channel.createMessageComponentCollector({ filter, time: time });
		collector.on('collect', async i => {
			if (i.customId.endsWith('namecolor')) {
				const colorRoles = message.guild.roles.cache.filter(role => role.name.startsWith('color_'));
				const colorEmbed = new Discord.MessageEmbed()
					.setTitle(`Your current name color: ${message.member.roles.highest.name.slice('color_'.length)}`)
					.setColor(message.member.roles.highest.name.slice('color_'.length).toUpperCase());
				const colorRow = new Discord.MessageActionRow()
					.addComponents(
						new Discord.MessageSelectMenu()
							.setCustomId('colorselect')
							.setPlaceholder('Choose your name color')
							.addOptions(colorRoles.map(role => {
								return {
									label: role.name.substr('color_'.length),
									value: role.name,
								};
							})),
					);
				await i.update({ embeds: [colorEmbed], components: [colorRow] });
			}
		});
	},
};
