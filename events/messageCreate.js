const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
let lastTalked;

const Json = require('../jsonHelper.js');
const Archive = require('../archiveHelper.js');
const Discord = require('discord.js');

const archiveChannel = '892599884107087892';

const HMMMMroles = [
	'747547541695889651', // gamer
	'712699459708125184', // booster
	'764299127059775533', // mod
	'764297888267894794', // admin
];

const crossChatChannels = [
	{
		server: '696079746697527376',
		channel: '926238726236024933',
		shardId: 1,
	},
	{
		server: '810280092013428807',
		channel: '926241815185747978',
		shardId: 0,
	},
	{
		server: '925170672399970324',
		channel: '926246227350274128',
		shardId: 0,
	},
	{
		server: '926262733534539816',
		channel: '926262965236301864',
		shardId: 0,
	},
	{
		server: '926307504533680169',
		channel: '926307685828288513',
		shardId: 0,
	},
];

const serversWithStats = [
	{
		server: '926307504533680169',
		memberCountChannel: '926568398828232804',
		botCountChannel: '926568420407922720',
		shardId: 0,
		memberText: 'members',
		botText: 'bots',
	},
	{
		server: '696079746697527376',
		memberCountChannel: '903076121539657758',
		botCountChannel: '903076402151174204',
		shardId: 1,
		memberText: 'gamers',
		botText: 'bots',
	},
	{
		server: '810280092013428807',
		memberCountChannel: '917095348395208754',
		botCountChannel: '917095537218551879',
		shardId: 0,
		memberText: 'quoters',
		botText: 'bots',
	},
];

function formatMessageContent(content) {
	const wordSplit = content.split(' ');
	const titleMax = 256;
	const descMax = 4096;
	let lastLength = 0;

	const titleWords = [];
	const descWords = [];

	for (let i = 0; i < wordSplit.length; i++) {
		const word = wordSplit[i];
		if (lastLength == 0) {
			lastLength += word.length;
		}
		else {
			lastLength += (word.length + 1);
		}
		if (lastLength <= titleMax) {
			titleWords.push(word);
		}
		else if (lastLength <= descMax) {
			descWords.push(word);
		}
	}
	return {
		title: titleWords.join(' '),
		description: descWords.join(' '),
	};
}

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (!message.author.bot) {
			for (const server of serversWithStats) {
				message.client.shard.broadcastEval(async (c, context) => {
					const guild = await c.guilds.fetch(context.server);
					const memberStat = await guild.channels.fetch(context.memberCountChannel);
					const botStat = await guild.channels.fetch(context.botCountChannel);

					await memberStat.setName(`${context.memberText}: ${guild.members.cache.filter(member => !member.user.bot).size}`);
					await botStat.setName(`${context.botText}: ${guild.members.cache.filter(member => member.user.bot).size}`);
				}, { shard: server.shardId, context: server });
			}
		}
		if (!message.author.bot && crossChatChannels.find(thing => thing.channel == message.channel.id)) {
			const formattedContent = formatMessageContent(message.content);
			const attachment = message.attachments.first();
			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
				.setColor(message.member.displayHexColor || 'RANDOM')
				.setTitle(formattedContent.title)
				.setFooter(message.guild.name, message.guild.iconURL())
				.setTimestamp();
			if (formattedContent.description.length > 0) {
				embed.setDescription(formattedContent.description);
			}
			if (attachment) embed.setImage(attachment.attachment);
			for (let i = 0; i < crossChatChannels.length; i++) {
				if (crossChatChannels[i].server != message.guild.id) {
					message.client.shard.broadcastEval(async (c, context) => {
						const channel = await c.channels.fetch(context.channelId);
						await channel.send({ embeds: [context.embed] });
					}, { shard: crossChatChannels[i].shardId, context: {
						embed: { ...embed },
						channelId: crossChatChannels[i].channel,
					} });
				}
			}
		}
		if (!message.author.bot && message.channel.type == 'GUILD_TEXT') {
			const archive = new Archive('892599884107087892', 0, message.client);

			/*

			const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
			const userData = await userDataJson.read();

			if (!userData.users[message.author.id]) {
				userData.users[message.author.id] = { games: [] };
			}
			if (!userData.users[message.author.id].messageCount) {
				userData.users[message.author.id].messageCount = 1;
			}
			else {
				userData.users[message.author.id].messageCount += 1;
			}
			await userDataJson.write(userData);

			*/

			await archive.log('MESSAGE', message);
			/*
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
				if (!embed.description && !embed.title) {
					embed.setDescription('n/a');
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
			*/
		}
		// lastTalked = message.author.id * message.channel.id;
	},
};