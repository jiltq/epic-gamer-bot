const Discord = require('discord.js');

module.exports = {
	name: 'yesnt',
	execute(message) {
		message.channel.send('tadah!');
	},
};
