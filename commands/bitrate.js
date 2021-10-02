const Discord = require('discord.js');
const dispatcherModule = require('../databases/dispatcher');

module.exports = {
	name: 'bitrate',
	description: 'Ajust the bitrate of the currently playing audio',
	usage: '[new bitrate]',
	async execute(message, args) {
		if (isNaN(parseInt(args) + (args - parseInt(args)))) return message.react('❌');

		const dispatcher = dispatcherModule.get();
		dispatcher.setBitrate(parseInt(args) + (args - parseInt(args)));
		message.react('✅');
	},
};
