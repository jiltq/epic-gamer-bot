const Discord = require('discord.js');

module.exports = {
	name: 'afk',
	execute(client, config) {
		function afktest() {
			client.channels.fetch('781607444370554892').then(channel =>{
				channel.send(`afk test (${new Date()})`);
			});
		}
		setInterval(afktest(), 3600000);
	},
};
