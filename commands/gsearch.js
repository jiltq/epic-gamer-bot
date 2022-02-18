const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const { getFavicon } = require('../utility.js');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData(url) {
	console.log('Crawling data...');
	// make http call to url
	const response = await axios(url).catch((err) => console.log(err));

	if(response.status !== 200) {
		console.log('Error occurred while fetching data');
		return;
	}
	return response;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gsearch')
		.setDescription('search google')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('thing to search for')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		/*
		const searchParams = new URLSearchParams({ q: interaction.options.getString('query') });
		console.log(`https://www.google.com/search?${searchParams.toString()}`);
		const res = await axios(`https://www.google.com/search?${searchParams.toString()}`);
		console.log(res);
		const html = res.data;
		const $ = cheerio.load(html);
		console.log($);

		$('div.g').each(function(i, elem) {
			const link = $(this);
			const descElem = $(elem).find('div.s');
			console.log(descElem.text());
			const text = link.text();

			console.log(text);
		});
		const links = [];
		const titles = [];
		const snippets = [];

		$('.yuRUbf > a').each((i, el) => {
			links[i] = $(el).attr('href');
		});
		$('.yuRUbf > a > h3').each((i, el) => {
			titles[i] = $(el).text();
		});
		$('.IsZvec').each((i, el) => {
			snippets[i] = $(el).text().trim();
		});

		const result = [];
		for (let i = 0; i < links.length; i++) {
			result[i] = {
				link: links[i],
				title: titles[i],
				snippet: snippets[i],
			};
		}
		*/

		const embed = new Discord.MessageEmbed()
			.setTitle(`google search results for "${interaction.options.getString('query')}`);

		await interaction.editReply({ embeds: [embed] });
	},
};
