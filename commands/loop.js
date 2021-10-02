const Discord = require('discord.js');
const dispatcherModule = require('../databases/dispatcher');

module.exports = {
	name: 'loop',
	description: 'Loop the currently playing audio',
	usage: '',
	async execute(message) {
		const looped = dispatcherModule.getLooped();
		if (looped == false) {
			const embed = new Discord.MessageEmbed()
				.setTitle('looping enabled!');
			message.channel.send(embed);
			dispatcherModule.updateLoop(true);
		}
		if (looped == true) {
			const embed = new Discord.MessageEmbed()
				.setTitle('looping disabled!');
			message.channel.send(embed);
			dispatcherModule.updateLoop(false);
		}
	},
};
