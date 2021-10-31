const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('goodbyejiltq')
		.setDescription('bye')
		.addStringOption(option =>
			option.setName('method')
				.setDescription('how to kill jiltq')
				.addChoice('sign out', '/l')
				.addChoice('restart', '/r')
				.addChoice('shutdown', '/s')
				.setRequired(true)),
	async execute(interaction) {
		if (interaction.user.id != '695662672687005737') return;
		await execFile('shutdown', [interaction.options.getString('method')]);
	},
};
