return;
const Discord = require('discord.js');
const IPM = require('../IPM.js');

module.exports = {
	name: 'eventschedule',
	description: 'See what time the next events are scheduled for',
	category: 'fun',
	args: false,
	async execute(message) {
		const gamedata = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/eventData.json');
		const timeRemaining = gamedata.nextTime - gamedata.lastTime;
	},
};
