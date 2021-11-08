const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timer')
		.setDescription('set a timer')
		.addIntegerOption(option =>
			option.setName('seconds')
				.setDescription('seconds to count down to')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('minutes')
				.setDescription('minutes to count down to')
				.setRequired(false)),
	defer: true,
	async execute(interaction) {
		return await interaction.reply('this command is being redone!!! sorry for the inconvenience <3 -jiltq');
		await interaction.deferReply({ ephemeral: true });
		const duration = interaction.options.getInteger('seconds') + ((interaction.options.getInteger('minutes') || 0) * 60);
		interaction.editReply(`timer for \`${interaction.options.getInteger('minutes') || 0}:${interaction.options.getInteger('seconds')}\` starting now!`);
		setTimeout(function() {
			const embed = new Discord.MessageEmbed()
				.setAuthor('timer completed!')
				.setFooter(`for ${interaction.options.getInteger('minutes') || 0}:${interaction.options.getInteger('seconds')}`);
			interaction.editReply({ embeds: [embed], ephemeral: true });
		}, duration * 1000);
	},
};
