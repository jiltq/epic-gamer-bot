const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const { getFavicon, embedColors } = require('../Decor.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wikipedia')
		.setDescription('search wikipedia')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	async execute(interaction) {
		const summary = await Web.fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${interaction.options.getString('query')}`);

		if (!summary.extract) throw new Error('No Wikipedia page exists!');

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'wikipedia', url: 'https://en.wikipedia.org', iconURL: getFavicon('https://en.wikipedia.org') })
			.setTitle(summary.title)
			.setColor(embedColors.default)
			.addField('definition', trim(summary.extract, 1024));

		if (summary.description) embed.setDescription(summary.description);
		if (summary.thumbnail) embed.setThumbnail(summary.thumbnail.source);
		await interaction.reply({ embeds: [embed] });
	},
};
