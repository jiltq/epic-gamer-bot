const Discord = require('discord.js');

module.exports = {
	name: 'admin_apply',
	description: 'Apply for admin!',
	execute(message, args) {
		if (message.member.hasPermission('ADMINISTRATOR')) {
			const embed = new Discord.MessageEmbed()
				.setTitle('you already have admin, silly!');
			return message.channel.send(embed);
		}
		if (message.member.hasPermission('ADMINISTRATOR') == false) {
			const embed = new Discord.MessageEmbed()
				.setTitle('your submission has been recorded!')
				.setFooter('cant wait to see how this ends lmao');
			console.log(`${message.author.username} WANTS ADMIN LOL`);
			return message.channel.send(embed);
		}
	},
};
