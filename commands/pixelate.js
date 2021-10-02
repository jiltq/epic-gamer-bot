const Discord = require('discord.js');
const fetch = require('node-fetch');

/*
	Fetch and send a random cat picture

	Created 8/26/2020 by jiltq
*/

module.exports = {
	name: 'pixelate',
	description: 'pixelate a picture',
	category: 'image',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args, IPM) {
		// const response = await IPM.fetch(`https://some-random-api.ml/canvas/invert?avatar=${message.attachments.array()[0].url}`);
		message.channel.send(`https://some-random-api.ml/canvas/pixelate?avatar=${message.attachments.array()[0].url}`);
	},
	async internal() {

	}
};
