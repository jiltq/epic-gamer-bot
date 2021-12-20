const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility.js');

const analyticsIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/analytics_icon.png`);

function getGames(data) {
	let games = [];

	const gamesRaw = Object.values(data.users).filter(user => user.games.length > 0).map(user => user.games.map(game => game.name));
	for (let i = 0;i < gamesRaw.length;i++) {
		const group = gamesRaw[i];
		for (let i2 = 0;i2 < group.length;i2++) {
			if (!games.includes(group[i2])) {
				games.push(group[i2]);
			}
		}
	}
	games = utility.removeDupes(games);
	return games;
}

function getGamesMax(userData) {
	const games0 = [];

	let games = Object.entries(userData.users).map(user => user[1].games.map(game =>{ return { name: game.name, timesPlayed: game.timesPlayed, players: [user[0]] };}));
	games = games.filter(game => game.length > 0);
	for (let i = 0;i < games.length;i++) {
		const group = games[i];
		for (let i2 = 0;i2 < group.length;i2++) {
			if (!games0.find(game => game.name == group[i2].name)) {
				games0.push(group[i2]);
			}
			else {
				games0.find(game => game.name == group[i2].name).timesPlayed += group[i2].timesPlayed;
				games0.find(game => game.name == group[i2].name).players.push(...group[i2].players);
			}
		}
	}
	return games0;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('analytics')
		.setDescription('nothing to see here'),
	async execute(interaction) {
		if (interaction.user.id != '695662672687005737') return interaction.editReply({ content: 'ERR UNAUTHORIZED', ephemeral: true });
		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

		const embed = new Discord.MessageEmbed()
			.setAuthor('egb analytics', 'attachment://analytics_icon.png')
			.setTitle('user data dashboard');

		const gameUpdatesSum = Object.values(userData.users).map(user => user.gameUpdates ? user.gameUpdates.length : 0).reduce((partial_sum, a) => partial_sum + a, 0);
		const messageSum = Object.values(userData.users).map(user => user.messageCount || 0).reduce((partial_sum, a) => partial_sum + a, 0);

		const games = getGamesMax(userData);
		games.sort(function(a, b) {
			return (b.timesPlayed * b.players.length) - (a.timesPlayed * a.players.length);
		});

		const stats = [
			{ key: 'users in database', value: Object.keys(userData.users).length },
			{ key: 'games in database', value: getGames(userData).length },
			{ key: 'game updates recorded', value: gameUpdatesSum },
			{ key: 'messages recorded', value: messageSum },
			{ key: 'avg. messages per user', value: (messageSum / Object.keys(userData.users).length).toFixed(2) },
			{ key: 'est. routines recorded', value: gameUpdatesSum / 2 },
		];
		stats.sort(function(a, b) {
			return b.value - a.value;
		});

		embed.addField('statistics', stats.map(stat => `${stat.key}: \`${stat.value}\``).join('\n'), true);
		embed.addField('games', games.map(game => `• ${game.name}: \`${game.timesPlayed * game.players.length}\` popularity`).join('\n'), true);

		interaction.reply({ embeds: [embed], files: [analyticsIcon], ephemeral: true });
	},
};