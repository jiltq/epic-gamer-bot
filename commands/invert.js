const Discord = require('discord.js');
const canvas = require('canvas');

module.exports = {
	name: 'invertold',
	description: 'invert an image',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args) {
		if (!message.attachments.array().length && !args.length) {
			const embed = new Discord.MessageEmbed()
				.setColor('#7F0000')
				.setAuthor('please attach an image or provide a link!');
			return message.channel.send(embed);
		}
		else if (message.attachments.array().length && !args.length) {
			const image = canvas.loadImage(message.attachments.array()[0].url);
			image.then(async () =>{
				const img = await canvas.loadImage(message.attachments.array()[0].url);
				const Canvas = canvas.createCanvas(img.width, img.height);
				const ctx = Canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, Canvas.width, Canvas.height);
				ctx.globalCompositeOperation = 'difference';
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, Canvas.width, Canvas.height);

				message.channel.send({
					files: [Canvas.toBuffer()],
				});
				// message.channel.send(`https://some-random-api.ml/canvas/invert?avatar=${message.attachments.array()[0].url}`);
			}).catch(err =>{
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('an unexpected error occured while inverting your image')
					.setTitle(`**${err.name}**`)
					.setDescription(`**${err.message || 'No error message has been provided'}**`);
				return message.channel.send(embed);
			});
		}
		else {
			const image = canvas.loadImage(args[0]);
			image.then(async () =>{
				const img = await canvas.loadImage(args[0]);
				const Canvas = canvas.createCanvas(img.width, img.height);
				const ctx = Canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, Canvas.width, Canvas.height);
				ctx.globalCompositeOperation = 'difference';
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, Canvas.width, Canvas.height);

				message.channel.send({
					files: [Canvas.toBuffer()],
				});
			}).catch(err =>{
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('an unexpected error occured while inverting your image')
					.setTitle(`**${err.name}**`)
					.setDescription(`**${err.message || 'No error message has been provided'}**`);
				return message.channel.send(embed);
			});
		}
	},
	async internal() {

	}
};
