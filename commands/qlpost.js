const Discord = require('discord.js');
const channelId = '810280215497539625';
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qlpost')
		.setDescription('submit a quote to quoteland')
		.addStringOption(option =>
			option.setName('link')
				.setDescription('link of the image')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('title of the quote')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('description of the quote')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const requiredId = 0;
		const msg = await interaction.client.shard.broadcastEval(async (c, { $image, $channelId, $author, $guildName, $title, $origin }) => {
			const $Discord = require('discord.js');
			const channel = await c.channels.fetch($channelId);
			const embed = new $Discord.MessageEmbed()
				.setAuthor(`${$author.name} - ${$guildName}`, $author.avatar)
				.setColor('RANDOM')
				.setImage($image)
				.setTimestamp()
				.setFooter('want to upload your own quote? use "/qlpost <url>"!');
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
		}, { shard: requiredId, context: { $image: interaction.options.getString('link'), $channelId: channelId, $author: {
			name: interaction.user.username,
			avatar: interaction.user.avatarURL(),
		}, $guildName: interaction.guild.name, $title: interaction.options.getString('title'), $origin: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.id}` } });
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
		interaction.editReply({ embeds: [confirmEmbed], components: [confirmRow], allowedMentions: { repliedUser: false } });
	},
};
