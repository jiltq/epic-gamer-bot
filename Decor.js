const Discord = require('discord.js');

module.exports = {
	embedColors: {
		default: '#2f3136',
		error: '#ed4245',
		warn: '#dbab79',
		success: '#57f287',
		failure: '#ed4245',
		reddit: '#FF4500',
		youtube: '#FF0000',
	},
	getIconAttachment(name) {
		return new Discord.MessageAttachment(`${process.cwd()}/assets/${name}.png`);
	},
	getFavicon(url) {
		return `https://www.google.com/s2/favicons?domain_url=${url}`;
	},
};