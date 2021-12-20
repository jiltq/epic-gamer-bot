const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility');
const Scraper = require('images-scraper');
const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: true },
});

const eventIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/event_icon.png`);

function getGame2Play(routines) {
	const time = Date.now();
	const hours = new Date().getHours();
	const day = new Date().getDay();
	const compatible = Object.values(routines).filter(routine => new Date(routine.start).getHours() <= hours && new Date(routine.end).getHours() >= hours && routine.day == day);
	if (compatible.length == 0) return null;
	return utility.random(compatible);
}
function formatRoutines(userData) {
	const gameRoutines = {};
	for (let i = 0;i < userData.gameUpdates.length;i++) {
		if (!Object.keys(gameRoutines).includes(userData.gameUpdates[i].game)) gameRoutines[userData.gameUpdates[i].game] = [];
		if (i > 0) {
			const day = new Date(userData.gameUpdates[i].time).getDay();

			if (userData.gameUpdates[i - 1].update == 'startPlaying' && userData.gameUpdates[i].update == 'stopPlaying') {
				gameRoutines[userData.gameUpdates[i].game].push({ type: 'spentPlaying', game: userData.gameUpdates[i].game, day: day, start: userData.gameUpdates[i - 1].time, end: userData.gameUpdates[i].time });
			}
		}
	}
	return gameRoutines;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoeventtest')
		.setDescription('test test test'),
	async execute(interaction) {
		await interaction.deferReply();
		if (interaction.user.id != '695662672687005737') return interaction.editReply({ content: 'ERR UNAUTHORIZED', ephemeral: true });
		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

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

		for (let i = 0;i < games0.length;i++) {
			for (let i2 = 0;i2 < games0[i].players.length;i2++) {
				const fetched = await interaction.guild.members.fetch(games0[i].players[i2]);
				games0[i].players[i2] = fetched;
			}
		}

		console.log(games0);

		games0.sort(function(a, b) {
			return (b.timesPlayed * b.players.length) - (a.timesPlayed * a.players.length);
		});

		console.log(formatRoutines(userData.users[interaction.user.id]));

		/*
		const dataEmbed = new Discord.MessageEmbed()
			.setTitle('auto event data');

		for (let i = 0;i < games0.length;i++) {
			const game = games0[i];
			dataEmbed.addField(game.name, `played **${game.timesPlayed}** time${game.timesPlayed > 1 ? 's' : ''}\n${game.players.map(player => `• ${player.toString()}`).join('\n\n')}`, true);
		}

		interaction.reply({ embeds: [dataEmbed], ephemeral: true });
        */

		let gameOptions = [];

		for (let i = 0;i < Object.keys(userData.users).length;i++) {
			const data = Object.values(userData.users)[i];
			if (data.gameUpdates) {
				const formatted = formatRoutines(data);
				gameOptions.push(getGame2Play(formatted));
			}
		}
		gameOptions = gameOptions.filter(game => game != null);

		let selectedGame;
		let alternative = false;
		if (gameOptions.length == 0) {
			selectedGame = utility.random(games0);
			alternative = true;
		}
		else {
			selectedGame = utility.random(gameOptions);
		}

		const image = (await google.scrape(selectedGame.name, 1))[0];

		const embed = new Discord.MessageEmbed()
			.setAuthor('auto events', 'attachment://event_icon.png')
			.setTitle(selectedGame.name)
			.setColor('#2f3136')
			.setImage(image.url)
			.setFooter(`👥 players: ${selectedGame.players.length}`);

		if (alternative) {
			embed.setDescription('⚠️ no routines have been established for this current time!\nusing alternative random game');
		}

		interaction.editReply({ embeds: [embed], files: [eventIcon] });
	},
};