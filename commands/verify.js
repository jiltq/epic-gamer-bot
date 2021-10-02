const utility = require('../utility.js');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'verify',
	description: 'Verify a user',
	usage: '[user mention, optional message to user]',
	category: 'moderation',
	creator: { 'name': 'jiltq' },
	args: true,
	cooldown: 60,
	async execute(message, args, IPM) {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;
		if (message.guild.id != '696079746697527376') return message.channel.send({ content: 'this command is reserved for epic gamers!' });
		const optionalMessage = args[1];
		const member = await utility.getMemberFromMention(args[0], message.guild);

		member.edit({ roles: [ member.guild.roles.cache.find(role => role.id == '747547541695889651')] }, 'New members are set with \'Unverified\' roles')
			.then(async promiseMember =>{
				const adminResponseEmbed = new Discord.MessageEmbed()
					.setColor('#007F00')
					.setTitle(`Successfully verified ${promiseMember.displayName}!`);
				message.channel.send(adminResponseEmbed);
				const memberResponseEmbed = new Discord.MessageEmbed()
					.setColor('#a88f7e')
					.setTitle('You\'ve been verified!')
					.setDescription(`We hope you enjoy your time in ${message.guild.name}`)
					.setFooter(`Verified by: ${message.member.displayName}`, message.author.displayAvatarURL())
					.setTimestamp();
				if (optionalMessage) {
					memberResponseEmbed.addField('Message from administrator', optionalMessage);
				}
				promiseMember.send(memberResponseEmbed);
				const logEmbed = new Discord.MessageEmbed()
					.setTitle(`User ${promiseMember.displayName} has been verified!`)
					.setThumbnail(promiseMember.user.displayAvatarURL())
					.setFooter(`Verified by: ${message.member.displayName}`, message.author.displayAvatarURL())
					.setTimestamp();
				message.client.channels.fetch('855067595861393408').then(channel =>{
					channel.send(logEmbed);
				});
			})
			.catch(async error =>{
				IPM.execute_internal_command('commanderror', { 'client': message.client, 'error': error, 'message': message, 'additionalInfo': 'Failed to verify user' });
			});
	},
};
