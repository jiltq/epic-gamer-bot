const Discord = require('discord.js');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { getFavicon } = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wikipedia')
		.setDescription('search wikipedia')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const summary = await web.fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${interaction.options.getString('query')}`);

		if (!summary.extract) throw new Error('No Wikipedia page exists!');

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'wikipedia', url: 'https://en.wikipedia.org', iconURL: getFavicon('https://en.wikipedia.org') })
			.setTitle(summary.title)
			.setColor('#2f3136')
			.addField('definition', trim(summary.extract, 1024));

		if (summary.description) embed.setDescription(summary.description);
		if (summary.thumbnail) embed.setThumbnail(summary.thumbnail.source);
		interaction.editReply({ embeds: [embed], ephemeral: true });
	},
};
