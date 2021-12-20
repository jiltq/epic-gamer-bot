const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility');

function getGame2Play(routines) {
	const time = Date.now();
	const hours = new Date().getHours();
	const day = new Date().getDay();
	const compatible = Object.values(routines).filter(routine => new Date(routine.start).getHours() <= hours && new Date(routine.end).getHours() >= hours && routine.day == day);
	if (compatible.length == 0) return null;
	return utility.random(compatible);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('routinetest')
		.setDescription('test test test')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('crap')
				.setRequired(false)),
	async execute(interaction) {
		if (interaction.user.id != '695662672687005737') return interaction.reply({ content: 'ERR UNAUTHORIZED', ephemeral: true });
		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

		const member = interaction.options.getUser('member') || interaction.user;

		const myData = userData.users[member.id];

		const statusDurations = [];

		const gameRoutines = {};

		/*

		for (let i = 0;i < myData.statusUpdates.length;i++) {
			if (i > 0) {
				const timeDifference = myData.statusUpdates[i].time - myData.statusUpdates[i - 1].time;

				// NOTE: the day starts at 0 for sunday and ends at 6 for saturday
				const day = new Date(myData.statusUpdates[i].time).getDay();

				if (myData.statusUpdates[i - 1].update == 'offline' && myData.statusUpdates[i].update == 'online') {
					statusDurations.push({ type: 'spentOffline', time: timeDifference, day: day, start: myData.statusUpdates[i - 1].time });
				}
				if (myData.statusUpdates[i - 1].update == 'online' && myData.statusUpdates[i].update == 'offline') {
					statusDurations.push({ type: 'spentOnline', time: timeDifference, day: day, start: myData.statusUpdates[i - 1].time });
				}
			}
		}
        */
		for (let i = 0;i < myData.gameUpdates.length;i++) {
			if (!Object.keys(gameRoutines).includes(myData.gameUpdates[i].game)) gameRoutines[myData.gameUpdates[i].game] = [];
			if (i > 0) {
				// NOTE: the day starts at 0 for sunday and ends at 6 for saturday
				const day = new Date(myData.gameUpdates[i].time).getDay();

				if (myData.gameUpdates[i - 1].update == 'startPlaying' && myData.gameUpdates[i].update == 'stopPlaying') {
					gameRoutines[myData.gameUpdates[i].game].push({ type: 'spentPlaying', game: myData.gameUpdates[i].game, day: day, start: myData.gameUpdates[i - 1].time, end: myData.gameUpdates[i].time });
				}
			}
		}
		console.log(gameRoutines);

		const reportEmbed = new Discord.MessageEmbed()
			.setTitle(`${member.username}'s routine report`);

		for (let i = 0;i < Object.values(gameRoutines).length;i++) {
			const routineGroup = Object.values(gameRoutines)[i];
			for (let i2 = 0;i2 < routineGroup.slice(-12 / Object.keys(gameRoutines).length).length;i2++) {
				const routine = routineGroup[i2];
				reportEmbed.addField(routine.game, `**date**: \`${new Date(routine.start).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\`\n**start**: \`${new Date(routine.start).toLocaleTimeString('en-US')}\`\n**end**: \`${new Date(routine.end).toLocaleTimeString('en-US')}\`\n**duration**: \`${((routine.end - routine.start) / 60000).toFixed(2)}\` minutes`, true);
			}
		}
		console.log(getGame2Play(gameRoutines));
		interaction.reply({ embeds: [reportEmbed], ephemeral: true });
	},
};