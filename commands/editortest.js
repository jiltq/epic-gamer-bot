const imageHelper = require('../imageHelper');
const queueManager = require('../queueManager');
const Discord = require('discord.js');

const embedHelper = require('../embedHelper');
const errorEmbed = new embedHelper.ErrorEmbed(Discord);

module.exports = {
	name: 'invert',
	description: 'Invert something!',
	category: 'image',
	usage: '[url to image/video/gif]',
	args: true,
	async execute(message, args) {
		const eventemitter = await imageHelper.returnEvent();
		await queueManager.add2Queue([{
			'url': args[0],
			'method': 'invert',
			'args': args.slice(1),
		}]);
		const queueEmbed = new Discord.MessageEmbed()
			.setAuthor('Content Editor')
			.setTitle('Content added to queue! ⏰')
			.setDescription('Maximum waiting times are approximately **1 minute**');
		message.reply({ embeds: [queueEmbed], allowedMentions: { repliedUser: false } });
		eventemitter.once('start', async () =>{
			const startEmbed = new Discord.MessageEmbed()
				.setAuthor('Content Editor')
				.setTitle('Editing started!')
				.setDescription('Depending on the size of the content, this may take a while');
			message.reply({ embeds: [startEmbed], allowedMentions: { repliedUser: false } });
		});
		eventemitter.once('done', async dir =>{
			console.log('done!');
			const file = new Discord.MessageAttachment(dir);
			const endEmbed = new Discord.MessageEmbed()
				.setAuthor('Content Editor')
				.setColor('#007F00')
				.setTitle('Content finished editing!')
				.setDescription('The editor is still in very early testing, so bugs will occur !!')
				.setImage(`attachment://${dir.substring(dir.lastIndexOf('/') + 1)}`)
				.setFooter('made with FFmpeg & Canvas with love <3');
			return message.reply({ embeds: [endEmbed], files: [file] });
		});
		eventemitter.once('error', async error =>{
			const errorembed = await errorEmbed.create('Something went wrong with editing this content.. <:sad:803026112065175603>', error.message);
			return message.reply({ embeds: [errorembed] });
		});
		eventemitter.once('unsupported', async () =>{
			const errorembed = await errorEmbed.create('Something went wrong with editing this content.. <:sad:803026112065175603>', 'You provided an unsupported file type!\nSome examples of supported file types include: .png, .mp4, .gif, .mp3');
			return message.reply({ embeds: [errorembed] });
		});
	},
};