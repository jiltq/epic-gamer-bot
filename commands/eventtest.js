const Discord = require('discord.js');
const eventManager = require('../eventManager.js');

module.exports = {
	name: 'eventtest',
	description: 'Test for event',
	category: 'dev',
	args: false,
	async execute(message) {
		return await eventManager.announceEvent(message.client);
	},
};
