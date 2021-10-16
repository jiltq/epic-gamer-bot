const Discord = require('discord.js');
const Scraper = require('images-scraper');
const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require('../utility.js');

const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: true },
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gimage')
		.setDescription('search google images')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	defer: true,
	async execute(interaction) {
		const images = await google.scrape(interaction.options.getString('query'), 100);
		const image = utility.random(images);
		const embed = new Discord.MessageEmbed()
			.setTitle(interaction.options.getString('query'))
			.setURL(image.source)
			.setImage(image.url);
		interaction.editReply({ embeds: [embed] });
	},
};
