const Discord = require('discord.js');

module.exports = {
	name: 'event',
	description: 'Announce an event!',
	usage: '',
	async execute(message, args) {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		const embed = new Discord.MessageEmbed()
			.setTitle('an event is happening!! woah!!')
			.setDescription(`**------------------------------**\n**"${args.join(' ')}"**`)
			.setFooter(`host: ${message.author.username}`, message.author.avatarURL());
		const members = message.guild.members.cache.filter(member => member.presence.status != 'offline' && member.id != '700455539557269575' && !member.user.bot);
		members.each(member => member.send({embeds: [embed]}));
	},
};
