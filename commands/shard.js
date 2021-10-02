const Discord = require('discord.js');

module.exports = {
	name: 'shard',
	description: 'See what shard is assigned to your server',
	category: 'dev',
	args: false,
	async execute(message) {
		const client = message.client;
		const embed = new Discord.MessageEmbed()
			.setTitle(`Server shard: ${client.shard.ids[0]}`)
			.addField('Total # of shards', client.shard.count.toString());
		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};
