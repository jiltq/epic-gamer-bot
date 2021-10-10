const Commands = require('../commandHelper.js');
const commands = new Commands('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/commands/');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (!message.author.bot && message.channel.type == 'GUILD_TEXT') {
			await message.client.shard.broadcastEval(async (c, { $message, author, $guildName, color, channelName }) => {
				const $Discord = require('discord.js');
				const channel = await c.channels.fetch('892599884107087892');
				const embed = new $Discord.MessageEmbed()
					.setAuthor(`${author.name} - ${$guildName} #${channelName}`, author.avatar)
					.setColor(color)
					.setFooter('This message was archived automatically')
					.setTimestamp();
				if ($message.content.split('\n')[0].length > 256) {
					embed.setDescription($message.content);
				}
				else {
					embed.setTitle($message.content.split('\n')[0]);
					embed.setDescription($message.content.slice($message.content.split('\n')[0].length || 0));
				}
				return channel.send({ embeds: [embed] });
			}, { shard: 0, context: { $message: message, author: {
				name: message.author.username,
				avatar: message.author.avatarURL(),
			}, $guildName: message.guild.name, color: message.member.displayHexColor || 'RANDOM', channelName: message.channel.name, 'trim': trim } });
		}
		const { command, args } = await commands.parse(message);
		if (await commands.cooldown(command, message)) return;
		return await command.execute(message, args);
	},
};