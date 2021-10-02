const Discord = require('discord.js');

module.exports = {
	name: 'embd',
	description: 'turn your message into an embed',
	category: 'utility',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args) {
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setColor(message.member.displayHexColor || '#202225')
			.setTitle(trim(args.join(' '), 256))
			.setTimestamp();
		return message.channel.send({embeds: [embed]});
	},
};
