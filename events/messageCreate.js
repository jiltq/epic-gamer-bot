const Commands = require('../commandHelper.js');
const commands = new Commands('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/commands/');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
let lastTalked;

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.content.startsWith('?')) {
			return message.channel.send('try out egb\'s slash commands here: https://discord.gg/NnhuHJCFS9');
		}
		if (!message.author.bot && message.channel.type == 'GUILD_TEXT') {
			await message.client.shard.broadcastEval(async (c, { $message, author, $guildName, color, channelName, $lastTalked, channelOriginId }) => {
				return;
				const $Discord = require('discord.js');
				const channel = await c.channels.fetch('892599884107087892');
				const embed = new $Discord.MessageEmbed()
					.setColor(color)
					.setTimestamp();
				if ($message.content.split('\n')[0].length > 256) {
					embed.setDescription($message.content);
				}
				else {
					embed.setTitle($message.content.split('\n')[0]);
					embed.setDescription($message.content.slice($message.content.split('\n')[0].length || 0));
				}
				if ($lastTalked != (author.id * channelOriginId)) {
					embed.setAuthor(`${author.name} - ${$guildName} #${channelName}`, author.avatar);
				}
				return channel.send({ embeds: [embed] });
			}, { shard: 0, context: { $message: message, author: {
				name: message.author.username,
				avatar: message.author.avatarURL(),
				id: message.author.id,
			}, $guildName: message.guild.name, color: message.member.displayHexColor || 'RANDOM', channelName: message.channel.name, 'trim': trim, $lastTalked: lastTalked, channelOriginId: message.channel.id } });
		}
		lastTalked = message.author.id * message.channel.id;
		const { command, args } = await commands.parse(message);
		if (await commands.cooldown(command, message)) return;
		return await command.execute(message, args);
	},
};