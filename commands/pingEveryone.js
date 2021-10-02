module.exports = {
	name: 'pingEveryone',
	description: 'Ping everyone!',
	execute(message, args) {
		if (args);
		if (message.author.id != '536344399492284439') return;
		message.channel.send('@everyone play whatever cheez wants you to play lol');
	},
};
