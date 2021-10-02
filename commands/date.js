const Discord = require('discord.js');

module.exports = {
	name: 'date',
	description: 'get the current date',
	usage: '',
	category: 'utility',
	args: false,
	async execute(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor('the date is currently')
			.setTitle(Date());
		message.channel.send({ embeds: [embed] });
	},
};
