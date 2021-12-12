const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('call')
		.setDescription('call someone')
		.addUserOption(option =>
			option.setName('recipient')
				.setDescription('who to call')
				.setRequired(true)),
	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		const recipient = interaction.options.getUser('recipient');
		if (!voiceChannel) {
			const errorEmbed = new Discord.MessageEmbed()
				.setColor('#ED4245')
				.setTitle('you must be in a voice channel!');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
		if (recipient.bot) {
			const errorEmbed = new Discord.MessageEmbed()
				.setColor('#ED4245')
				.setTitle('you cannot call bots!');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
		const invite = await voiceChannel.createInvite({ reason: `${interaction.user.username} called ${recipient.username}`, maxAge: 3600 });
		const embed = new Discord.MessageEmbed()
			.setAuthor(interaction.guild.name, interaction.guild.iconURL())
			.setThumbnail(interaction.user.avatarURL())
			.setTitle(interaction.user.username)
			.setColor(interaction.member.displayHexColor || '#202225')
			.setDescription('incoming call');
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setEmoji('📞')
					.setLabel('join call')
					.setURL(invite.url)
					.setStyle('LINK'),
				new Discord.MessageButton()
					.setEmoji('❌')
					.setLabel('decline')
					.setCustomId(`${interaction.id}decline`)
					.setStyle('DANGER'),
			);
		await recipient.send({ embeds: [embed], components: [row] })
			.then(async () =>{
				const successEmbed = new Discord.MessageEmbed()
					.setColor('#57F287')
					.setTitle(`successfully invited ${recipient.username}`);
				return interaction.reply({ embeds: [successEmbed], ephemeral: true });
			});
	},
};
