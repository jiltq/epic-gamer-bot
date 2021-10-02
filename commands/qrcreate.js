const querystring = require('querystring');
const Discord = require('discord.js');

module.exports = {
	name: 'qrcreate',
	description: 'Creates a QR code',
	category: 'utility',
	args: true,
	async execute(message, args) {
		const query = querystring.stringify({ data: args.join(' ') });
		const embed = new Discord.MessageEmbed()
			.setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&${query}`)
			.setFooter('powered by goqr.me');
		return message.channel.send(embed);
	},
};
