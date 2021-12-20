const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamedata')
		.setDescription('nothing here'),
	async execute(interaction) {
		if (interaction.user.id != '695662672687005737') return interaction.reply({ content: 'ERR UNAUTHORIZED', ephemeral: true });
		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

		let games = Object.entries(userData.users).map(user => user[1].games);
		games = games.filter(game => game.length > 0).map(_games => _games.map(game => game.name));
		games = utility.removeDupes(games);
		console.log(games);
	},
};