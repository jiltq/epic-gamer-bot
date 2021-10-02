const Discord = require('discord.js');

module.exports = {
	name: 'pping',
	description: 'Ping, but not HARDCODED\nDISCORD.JS IM LOOKING AT YOU',
	category: 'utility',
	args: false,
	async execute(message) {
		const ping = Math.round(message.client.ws.ping);
		const embed = new Discord.MessageEmbed()
			.setTitle(`Ping: ${ping} ms 🏓`);
		if (ping < 250) embed.setColor('#007F00');
		else if (ping < 500) embed.setColor('#FFD700');
		else if (ping < 1500) embed.setColor('#ed4245');
		else if (ping < 6000) embed.setColor('#7F0000');
		return message.channel.send({ embeds: [embed] });
	},
};
