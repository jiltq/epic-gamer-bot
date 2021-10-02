const Discord = require('discord.js');

module.exports = {
	name: 'server',
	description: 'Ping',
	async execute(message, args) {
		return;
		const guild = message.guild;
		// const partneredEmoji = message.client.emojis.cache.array.find(emoji => emoji.guild.id == '811393728504659998' && emoji.name == 'PartneredServer')
		const embed = new Discord.MessageEmbed();
		embed.setTitle(`${guild.name}`);
		embed.setDescription(guild.description);
		embed.setThumbnail(guild.iconURL());
		embed.setImage(guild.bannerURL());
		message.channel.send(embed);
	},
};
