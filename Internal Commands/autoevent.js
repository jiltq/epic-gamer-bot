const games = require('../JSON/games.json');
const utility = require('../utility.js');
const Scraper = require('images-scraper');
const Discord = require('discord.js');
const Canvas = require('canvas');
const getColors = require('get-image-colors');
const fetch = require('node-fetch');
const IPM = require('../IPM.js');

const interval = 60000;
const channelID = '815022946422358016';

const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: true },
});

async function autoEventB(client) {
	console.log('a');
	const index = utility.randomNumber(1, games.games.length);
	const gameName = games.games[index];
	console.log(gameName);
	//const desc = await IPM.return_command_data('wiki', null, null, gameName);
	let result = await google.scrape(gameName, 1);
	result = result[0].url;
	console.log(result);
	const embed = new Discord.MessageEmbed()
		.setAuthor('recommended game')
		.setTitle(gameName)
		//.setDescription(desc || '')
		.setImage(result);
	client.channels.fetch(channelID).then(channel =>{
		channel.send(embed);
	});
}

console.log('e');
module.exports = {
	async first(client) {
		if (!client.shardID) return;
		autoEventB(client);
		setInterval(function() {autoEventB(client);}, interval);
	},
};
