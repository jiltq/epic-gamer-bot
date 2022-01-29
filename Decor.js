const Discord = require('discord.js');

module.exports = {
	embedColors: {
		default: '#2f3136',
		error: '#ed4245',
		warn: '#dbab79',
		success: '#57f287',
	},
	getIconAttachment(name) {
		return new Discord.MessageAttachment(`${process.cwd()}/assets/${name}.png`);
	},
};