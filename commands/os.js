const Discord = require('discord.js');
const os = require('os');

module.exports = {
	name: 'os',
	description: 'Pause the currently playing music',
	usage: '',
	execute(message) {
		message.channel.send(`CPU ARCHITECTURE: ${os.arch()}\nOS COSTANTS: ${Object.keys(os.constants)}\nCPU'S: ${os.cpus()}`);
	},
};
