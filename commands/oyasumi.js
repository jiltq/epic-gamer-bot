const Discord = require('discord.js');

module.exports = {
	name: 'oyasumi',
	description: 'i know that it\'s hard to do',
	category: 'fun',
	async execute(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('**close your eyes and you\'ll leave this dream**');
		message.channel.send({embeds:[embed]});
	},
};
