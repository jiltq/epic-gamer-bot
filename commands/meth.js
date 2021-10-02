const Discord = require('discord.js');

module.exports = {
	name: 'meth',
	description: 'why',
	category: 'fun',
	async execute(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor('dude what were you thinking')
			.setTitle('**please tell me this was a joke or a typo**')
			.setFooter('why');
		message.channel.send(embed);
	},
};
