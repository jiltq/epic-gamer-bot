const Discord = require('discord.js');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('search wikipedia')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	defer: true,
	async execute(interaction) {
		await interaction.deferReply();
		const querystr = querystring.stringify({ titles: interaction.options.getString('query') });
		const result = await web.fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&${querystr}`);
		const extract = result.query.pages[Object.keys(result.query.pages)[0]].extract;
		const { window } = new JSDOM(extract);
		const jquery = require('jquery')(window);
		const newtext = jquery(window.document).html(extract).text();
		const title = result.query.pages[Object.keys(result.query.pages)[0]].title;

		const embed = new Discord.MessageEmbed()
			.setAuthor('wikipedia', 'https://www.google.com/s2/favicons?domain_url=en.wikipedia.org', 'https://en.wikipedia.org')
			.setTitle(title)
			.addField('definition', trim(newtext || 'error: definition not available', 1024))
			.setFooter('powered by en.wikipedia.org');
		interaction.editReply({ embeds: [embed] });
	},
};
