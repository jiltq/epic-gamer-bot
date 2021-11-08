const Discord = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roblox')
		.setDescription('search up something on roblox')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('type to search for')
				.addChoice('game', 'game')
				.addChoice('group', 'group')
				.addChoice('user', 'user')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search for')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const query = querystring.stringify({ keyword: interaction.options.getString('query') });
		let embed;
		if (interaction.options.getString('type') == 'user') {
			const results = await web.fetch(`https://users.roblox.com/v1/users/search?${query}&limit=10`);
			const user = results.data[0];
			const detailedUser = await web.fetch(`https://users.roblox.com/v1/users/${user.id}`);
			const bust = await web.fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${user.id}&size=150x150&format=Png&isCircular=true`);

			embed = new Discord.MessageEmbed()
				.setAuthor('roblox', 'https://www.google.com/s2/favicons?domain=www.roblox.com', 'https://www.roblox.com')
				.setTitle(user.displayName)
				.setDescription(`@${user.name}`)
				.setURL(`https://www.roblox.com/users/${user.id}/profile`)
				.setThumbnail(bust.data[0].imageUrl)
				.addField('about', detailedUser.description);
		}
		return await interaction.editReply({ embeds: [embed] });
	},
};
