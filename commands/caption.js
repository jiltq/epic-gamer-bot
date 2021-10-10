const Discord = require('discord.js');
const { Worker } = require('worker_threads');
const visuals = require('../visuals.js');

module.exports = {
	name: 'caption',
	description: 'Give a caption to an image',
	category: 'image',
	args: true,
	async execute(message, args) {
		const image = message.attachments.first() ? message.attachments.first().url : args[0];
		const text = message.attachments.first() ? args[0] : args[1];
		const worker = new Worker('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/imageHelper2.js', {
			workerData: {
				method: 'caption',
				media: image,
				args: {
					text: text,
				},
			},
		});
		const timeout = setTimeout(async () => {
			worker.terminate();
			return message.reply({ content: 'it took me too long to edit your image, so i ragequit :(' });
		}, 900000);
		worker.on('message', async data =>{
			if (data.status == 'done') {
				clearTimeout(timeout);
				const embed = new Discord.MessageEmbed()
					.setTitle('*tadah!* ✨  here\'s your file')
					.setImage(`attachment://${data.attachment.name}`);
				return await message.reply({ embeds: [embed], files: [data.attachment] });
			}
			if (data.status == 'start') {
				message.reply({ embeds: [visuals.embeds.load(module, 'k give me a sec')], allowedMentions: { repliedUser: false } });
			}
		});
	},
};
