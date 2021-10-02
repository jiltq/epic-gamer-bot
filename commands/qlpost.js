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
		const image = args[0] || message.attachments.first().url;
		// const requiredId = this.message.client.shard.shardIdForGuildId(guildId);
		const requiredId = 0;
		message.client.shard.broadcastEval(async (c, { $image, $channelId, $author, $guildName }) => {
			const $Discord = require('discord.js');
			const channel = await c.channels.fetch($channelId);
			const embed = new $Discord.MessageEmbed()
				.setAuthor(`${$author.name} - ${$guildName}`, $author.avatar)
				.setColor('RANDOM')
				.setImage($image)
				.setTimestamp()
				.setFooter('want to upload your own quote? use "?qlpost <url>"!');
			return channel.send({ embeds: [embed] });
		}, { shard: requiredId, context: { $image: image, $channelId: channelId, $author: {
			name: message.author.username,
			avatar: message.author.avatarURL(),
		}, $guildName: message.guild.name } })
			.then(async () =>{
				const embed = new Discord.MessageEmbed()
					.setColor('#0dbc79')
					.setTitle('Successfully uploaded your quote! Come check it out here:');
				message.channel.send({ embeds:[embed] });
				return await (message.client.commands.get('embedresponse')).execute(message, ['quoteland']);
			});
	},
};
