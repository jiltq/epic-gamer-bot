const Discord = require('discord.js');

module.exports = {
	name: 'announce',
	description: 'Announce an announcement!',
	usage: '',
	category: 'utility',
	permissions: 'ADMINISTRATOR',
	async execute(message, args) {
		const members = message.guild.members.cache.filter(member => member.roles.cache.map(role => role.id).includes('747547541695889651') && member.id != message.author.id);
		members.each(member =>{
			const embed = new Discord.MessageEmbed()
				.setTitle('announcement')
				.setColor(member.displayHexColor || '#0099ff')
				.setDescription(`**------------**\n**"${args.join(' ')}"**`)
				.setFooter(`announcer: ${message.author.username}`, message.author.avatarURL());
			member.send({ embeds: [embed] });
		});
	},
};
