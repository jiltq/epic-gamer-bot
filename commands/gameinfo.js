const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gameinfo')
		.setDescription('get information about a game')
		.addStringOption(option =>
			option.setName('game')
				.setDescription('game to get information about')
				.addChoice('roblox', 'game_roblox')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('info')
				.setDescription('type of info to get')
				.addChoice('player', 'info_player')
				.setRequired(true)),
	async execute(interaction) {

	},
};
