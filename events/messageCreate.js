const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
let lastTalked;

const archiveChannel = '892599884107087892';

const HMMMMroles = [
	'747547541695889651', // gamer
	'712699459708125184', // booster
	'764299127059775533', // mod
	'764297888267894794', // admin
];

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (!message.author.bot && message.channel.type == 'GUILD_TEXT') {
			await message.client.shard.broadcastEval(async (c, { $message, $lastTalked, $attachment, $archiveChannel, $guild, $author, $originChannel }) => {
				const $Discord = require('discord.js');
				const channel = await c.channels.fetch($archiveChannel);
				const embed = new $Discord.MessageEmbed()
					.setColor($author.color)
					.setTimestamp();
				if ($attachment) embed.setImage($attachment.attachment);
				if ($message.content.split('\n')[0].length > 256) {
					embed.setDescription($message.content);
				}
				else {
					embed.setTitle($message.content.split('\n')[0]);
					if ($message.content.split('\n')[0]) {
						embed.setDescription($message.content.slice($message.content.split('\n')[0].length || 0));
					}
				}
				if ($lastTalked != ($author.id * $originChannel.id)) {
					embed.setAuthor($author.name, $author.avatar);
					embed.setFooter(`${$guild.name}  #${$originChannel.name}`, $guild.icon);
				}
				return channel.send({ embeds: [embed] });
			}, { shard: 0, context: {
				$message: message,
				'trim': trim,
				$lastTalked: lastTalked,
				$attachment: message.attachments.first(),
				$archiveChannel: archiveChannel,
				$guild: {
					name: message.guild.name,
					icon: message.guild.iconURL(),
				},
				$author: {
					name: message.author.username,
					avatar: message.author.avatarURL(),
					color: message.member.displayHexColor || 'RANDOM',
					id: message.author.id,
				},
				$originChannel: {
					name: message.channel.name,
					id: message.channel.id,
				},
			} });
		}
		lastTalked = message.author.id * message.channel.id;
	},
};