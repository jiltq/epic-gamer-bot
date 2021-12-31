const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandHelper } = require('../commandHelper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refreshcommands')
		.setDescription('refresh guild application commands')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('server id')
				.setRequired(true)),
	defaultPermission: false,
	permissions: [
		{
			id: '695662672687005737',
			type: 'USER',
			permission: true,
		},
	],
	async execute(interaction) {
		await interaction.deferReply();
		const guildId = interaction.options.getString('id');
		const commandHelper = new CommandHelper({ path: `${process.cwd()}/commands`, client: interaction.client });
		await commandHelper.removeGuildCommands(guildId);

		const embed = new Discord.MessageEmbed()
			.setTitle('successfully refreshed application commands for this server');

		interaction.editReply({ embeds: [embed] });
	},
};
