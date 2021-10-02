const Discord = require('discord.js');
const Scraper = require('images-scraper');

const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: 'on' },
});

module.exports = {
	name: 'sendmeyourcode',
	description: 'what',
	async execute(message) {
		const result = await google.scrape('No, I don\'t think I will', 1);
		const embed = new Discord.MessageEmbed()
			.setImage(result[0]['url']);
		message.channel.send(embed);
	},
};
