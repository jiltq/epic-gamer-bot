const Discord = require('discord.js');

module.exports = {
	name: 'ratelimit',
	internal: true,
	execute(client, rateLimitInfo) {
		var timeout = rateLimitInfo.timeout;
		var timeoutFormat = 'ms';
		if (timeout >= 1000 && timeout < 60000) {
			timeout /= 1000;
			timeoutFormat = 'seconds';
		}
		else if (timeout >= 60000) {
			timeout /= 60000;
			timeoutFormat = 'minutes';
		}
		console.log('\x1b[33m%s\x1b[0m', `Currently ratelimited for: ${timeout} ${timeoutFormat}`);
	},
};
