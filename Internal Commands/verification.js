const Discord = require('discord.js');

module.exports = {
	name: 'verification',
	async execute(options) {
		const member = options.member;

		if (member.guild.id != '696079746697527376') return;
		const unverifiedRole = await member.guild.roles.cache.find(role => role.id == '764950889534062672');

		if (member.user.bot) return;

		try {
			member.edit({ roles: [ member.guild.roles.cache.find(role => role.id == '764950889534062672')] }, 'New members are set with \'Unverified\' roles');
		}
		catch (error) {
			console.log(error);
		}
		const embed = new Discord.MessageEmbed()
			.setColor('#a88f7e')
			.setTitle(`welcome to epic gamers, ${member.user.username.toLowerCase()}!`)
			.setDescription('**please be patient while you are being verified**')
			.setFooter(`You are ${unverifiedRole.members.array().length + 1} in queue`)
			.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128');

		member.send({ embeds: [embed] })
			.catch(error =>{
				console.log('something went wrong while welcoming a new epic gamer to the server :(');
				console.log(error);
			})
			.then(() =>{
				member.guild.members.fetch('695662672687005737').then(jiltq =>{
					const notification_embed = new Discord.MessageEmbed()
						.setAuthor(`${member.user.username.toLowerCase()} is awaiting verification!`)
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp();
					jiltq.send({ embeds: [notification_embed] });
				});
			});
	},
};
