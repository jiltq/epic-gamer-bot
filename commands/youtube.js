const yts = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('search youtube')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	defer: true,
	async execute(interaction) {
		await interaction.deferReply();
		const r = await yts(interaction.options.getString('query'));
		const url = r.videos[0].url;
		const embed = new Discord.MessageEmbed({
			title: 'hi',
			video: {
				url: url,
				height: 500,
				width: 500,
			},
			provider: {
				name: 'joe mama',
				url: 'https://speedtest.net',
			},
		});
		interaction.editReply({ embeds: [embed] });
	},
};
