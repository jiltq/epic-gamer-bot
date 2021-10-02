const udm = require('../userdatamanager.js');
const Discord = require('discord.js');

module.exports = {
	name: 'balance',
	description: 'Sbows your current balance in currency',
	async execute(message, args) {
		const wealth = await udm.readProperty(message.author.id, 'wealth');
		const embed = new Discord.MessageEmbed()
			.setTitle(`You currently have $${wealth}, buckaroo`);
		return message.channel.send(embed);
	},
};
