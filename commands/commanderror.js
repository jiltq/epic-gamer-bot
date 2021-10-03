const Discord = require('discord.js');
let lastTime = 0;

/*
	Internal command module to handle command errors
*/

module.exports = {
	name: 'commanderror',
	internal: true,
	async execute(options) {
		const d = Date.now();
		// if ((d - lastTime) < 1000) return;
		const error = options.error;const message = options.message;
		if (error.message.search(/C:/gi) != -1) {
			throw new Error('Attemped to print file directory');
		}

		const errorReport = new Discord.MessageEmbed()
			.setColor('#7F0000')
			.setTitle('something went wrong with executing this command :(')
			.addField(error.name || 'undefined', error.message || 'undefined')
			.setTimestamp()
			.setFooter('If this problem persists, please report it to jiltq or someone idk');
		if (options.additionalInfo) errorReport.setDescription(`"${options.additionalInfo}"`);
		message.channel.send({ embeds: [errorReport] });
		console.error('\x1b[31m%s\x1b[0m', error.message);
		const nd = Date.now();
		lastTime = nd;
	},
};
