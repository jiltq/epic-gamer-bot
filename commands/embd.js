const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embd')
		.setDescription('convert your message into an embed')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('message to convert')
				.setRequired(true)),
	async execute(interaction) {
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		const embed = new Discord.MessageEmbed()
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
			.setColor(interaction.member.displayHexColor || '#202225')
			.setTitle(trim(interaction.options.getString('message'), 256))
			.setTimestamp();
		return interaction.reply({ embeds: [embed] });
	},
};
