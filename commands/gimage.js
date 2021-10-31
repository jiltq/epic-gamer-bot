const Discord = require('discord.js');
const Scraper = require('images-scraper');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gimage')
		.setDescription('search google images')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('safe')
				.setDescription('whether or not to use safesearch')
				.setRequired(false),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const safe = interaction.options.getBoolean('safe') != null ? interaction.options.getBoolean('safe') : true;
		const google = new Scraper({
			puppeteer: {
				headless: true,
			},
			tbs: { safe: safe },
		});
		const images = await google.scrape(interaction.options.getString('query'), 100);
		const image = utility.random(images);
		const embed = new Discord.MessageEmbed()
			.setTitle(interaction.options.getString('query'))
			.setURL(image.source)
			.setImage(image.url);
		if (!safe) {
			embed.setFooter('😳 NSFW');
		}
		await interaction.deleteReply();
		await interaction.followUp({ embeds: [embed], ephemeral: !safe });
	},
};
