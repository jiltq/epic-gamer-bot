const Discord = require('discord.js');

const dmModeRole = '893577070964252782';

module.exports = {
	name: 'call',
	description: 'Invite members to a voice channel!',
	args: false,
	async execute(message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.react('❌');
		if (message.member.roles.cache.has(dmModeRole)) {
			const role = await message.guild.roles.cache.get(dmModeRole);
			const members = role.members.filter(member => member.id != message.author.id);
			members.forEach(async member =>{
				const invite = await voiceChannel.createInvite({ reason: 'To invite others to the VC', maxAge: 3600 });
				const inviteEmbed = new Discord.MessageEmbed()
					.setAuthor(message.guild.name, message.guild.iconURL())
					.setThumbnail(message.author.avatarURL())
					.setTitle(message.author.username)
					.setColor(message.member.displayHexColor || '#202225')
					.setDescription('Incoming Call');
				const row = new Discord.MessageActionRow()
					.addComponents(
						new Discord.MessageButton()
							.setEmoji('📞')
							.setLabel('Join Call')
							.setURL(invite.url)
							.setStyle('LINK'),
						new Discord.MessageButton()
							.setEmoji('❌')
							.setLabel('Decline')
							.setCustomId(`${message.id}decline`)
							.setStyle('DANGER'),
					);
				await member.send({ embeds: [inviteEmbed], components: [row] });
			});
		}
		else {
			return message.react('❌');
		}
	},
};
