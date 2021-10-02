const imageEditor = require('../imageEditor');
const Discord = require('discord.js');
module.exports = {
	name: 'edit',
	description: 'Edit an image\n\nCurrent functions: ',
	category: 'image',
	args: false,
	async execute(message, args, IPM) {
		const ImageEditor = new imageEditor.ImageEditor(message, IPM, Discord);
		if (args.length != 0) {
			await ImageEditor.start(args[0]);
		}
		else if (message.attachments.size != 0) {
			await ImageEditor.start(message.attachments.first().url);
		}
	},
};
