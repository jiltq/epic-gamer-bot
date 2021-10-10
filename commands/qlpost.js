const Discord = require('discord.js');
const channelId = '810280215497539625';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qlpost')
		.setDescription('Submit a quote to Quoteland')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the image')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Title of the quote')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('Description of the quote')
				.setRequired(false)),
	name: 'qlpost',
	description: 'Post an image to quoteland',
	args: false,
	usage: '[image link]',
	async execute(message, args) {
		const image = message.attachments.first() ? message.attachments.first().url : args[0];
		const title = message.attachments.first() ? args[0] : args[1];
		const requiredId = 0;
		const msg = await message.client.shard.broadcastEval(async (c, { $image, $channelId, $author, $guildName, $title, $origin }) => {
			const $Discord = require('discord.js');
			const channel = await c.channels.fetch($channelId);
			const embed = new $Discord.MessageEmbed()
				.setAuthor(`${$author.name} - ${$guildName}`, $author.avatar)
				.setColor('RANDOM')
				.setImage($image)
				.setTimestamp()
				.setFooter('want to upload your own quote? use "?qlpost <url>"!');
			if ($title) {
				embed.setTitle($title);
			}
			const originRow = new $Discord.MessageActionRow()
				.addComponents(
					new $Discord.MessageButton()
						.setLabel('view origin')
						.setURL($origin)
						.setStyle('LINK'),
				);
			return await channel.send({ embeds: [embed], components: [originRow] });
		}, { shard: requiredId, context: { $image: image, $channelId: channelId, $author: {
			name: message.author.username,
			avatar: message.author.avatarURL(),
		}, $guildName: message.guild.name, $title: title, $origin: `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}` } });
		const confirmEmbed = new Discord.MessageEmbed()
			.setTitle('successfully uploaded your quote!')
			.setColor('#0dbc79');
		const confirmRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('come see it here')
					.setURL(`https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`)
					.setStyle('LINK'),
			);
		message.reply({ embeds: [confirmEmbed], components: [confirmRow], allowedMentions: { repliedUser: false } });
	},
};
