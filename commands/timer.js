const Discord = require('discord.js');

module.exports = {
	name: 'timer',
	description: 'set a timer',
	category: 'utility',
	cooldown: 1,
	usage: '[seconds to count down to]',
	args: true,
	async execute(message, args) {
		const parsed = Math.abs(parseFloat(args));
		if (isNaN(parsed) || parsed > (2147483647 / 1000)) {
			const embed = new Discord.MessageEmbed()
				.setColor('#7F0000')
				.setAuthor('please provide a valid number!')
				.setFooter(`allowed numbers: 0 - ${2147483647 / 1000}`);
			return message.channel.send({ embeds: [embed] });
		}
		const multiple = parsed != 1;
		message.channel.send(`Timer for ${parsed} second(s) starts now!`);
		setTimeout(function() {
			const embed = new Discord.MessageEmbed()
				.setAuthor('timer completed!');
			if (multiple) embed.setFooter(`for ${parsed} seconds`);
			else embed.setFooter(`for ${parsed} second`);
			message.channel.send({ embeds: [embed] });
		}, parsed * 1000);
	},
};
