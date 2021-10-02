const Discord = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const embedHelper = require('../embedHelper');
const errorEmbed = new embedHelper.ErrorEmbed(Discord);

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	name: 'wiki',
	description: 'wikipedia',
	category: 'utility',
	usage: '[term to search up]',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args) {
		const querystr = querystring.stringify({ titles: args.join(' ') });
		// const queryImage = querystring.stringify({ titles: args.join(' ') });
		const result = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&${querystr}`).then(response => response.json());
		// const imageResult = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&${queryImage}`).then(response => response.json());
		const extract = result.query.pages[Object.keys(result.query.pages)[0]].extract;
		/*
		let image;
		if (!imageResult.query.pages[0].thumbnail) {
			image = '';
		}
		else {
			image = imageResult.query.pages[0].thumbnail.source;
		}
		*/
		if (!extract) {
			const embed = await errorEmbed.create('no results found!', 'check your spelling or try different keywords');
			return message.channel.send({ embeds: [embed] });
		}
		const { window } = new JSDOM(extract);
		const jquery = require('jquery')(window);
		const newtext = jquery(window.document).html(extract).text();
		const title = result.query.pages[Object.keys(result.query.pages)[0]].title;

		const embed = new Discord.MessageEmbed()
			.setAuthor(title)
			.addField('Definition', trim(newtext || 'error: definition not available', 1024))
			.setFooter('powered by en.wikipedia.org');
		message.channel.send({ embeds: [embed] });
	},
	async internal(message, args, searchquery) {
		const querystr = querystring.stringify({ titles: searchquery });
		const result = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&${querystr}`).then(response => response.json());
		let extract = result.query.pages[Object.keys(result.query.pages)[0]].extract;
		const { window } = new JSDOM(extract);
		const jquery = require('jquery')(window);
		extract = jquery(window.document).html(extract).text();
		return extract;
	},
};
