/*
    This class is designed to help archive events to the archive channel.
*/
const types = [
	'COMMAND',
	'MESSAGE',
];

class Archive {
	constructor(channelId, shardId, client) {
		this.channelId = channelId;
		this.shardId = shardId;
		this.client = client;
		this.lastTalked = 0;
	}
	async log(type, data) {
		if (!types.includes(type)) throw new Error(`type "${type}" is not valid!`);
		const archiveContext = { data: { ...data } };
		archiveContext.archiveType = type;
		archiveContext.archiveChannel = this.channelId;
		archiveContext.lastTalked = this.lastTalked;
		if (type == 'MESSAGE') archiveContext.data.user = archiveContext.data.author;
		if (type == 'COMMAND') archiveContext.data.formatted = data.toString();
		archiveContext.data.guild = {
			name: data.guild.name,
			icon: data.guild.iconURL(),
		};
		archiveContext.data.channel = {
			name: data.channel.name,
		};
		await this.client.shard.broadcastEval(async (c, context) => {
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
			const Discord = require('discord.js');
			const channel = await c.channels.fetch(context.archiveChannel);
			const embed = new Discord.MessageEmbed()
				.setTimestamp();
			if (context.archiveType == 'COMMAND') {
				embed.setTitle(`${context.data.formatted}`);
			}
			else if (context.archiveType == 'MESSAGE') {
				const formatted = formatMessageContent(context.data.content);
				embed.setTitle(formatted.title);
				if (formatted.description.length > 0) embed.setDescription(formatted.description);
			}
			if (context.lastTalked != (context.data.user.id * context.data.channelId)) {
				embed.setAuthor({ name: context.data.user.username, iconURL: context.data.user.avatarURL });
				embed.setFooter(`${context.data.guild.name}  #${context.data.channel.name}`, context.data.guild.icon);
			}
			return await channel.send({ embeds: [embed] });
		}, { shard: this.shardId, context: archiveContext });
		this.lastTalked = archiveContext.data.user.id * archiveContext.data.channelId;
	}
}
module.exports = Archive;