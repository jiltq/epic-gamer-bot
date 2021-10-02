const Jimp = require('jimp');
const fsp = require('fs').promises;
const getColors = require('get-image-colors');

const imagePath = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/imageEdit.png';

module.exports = {
	ImageEditor: class ImageEditor {
		constructor(message, IPM, Discord) {
			this.message = message;
			this.IPM = IPM;
			this.Discord = Discord;
		}
		async start(url) {
			let editIterations = 0;
			await fsp.writeFile(imagePath, '');
			await fsp.unlink(imagePath);
			const startImage = await Jimp.read(url);
			await startImage.writeAsync(imagePath);
			let color;
			color = (await getColors(imagePath)).map(clr => clr.hex())[0];
			const startEmbed = new this.Discord.MessageEmbed()
				.setTitle('Your Image')
				.setColor(color)
				.setImage(url)
				.setDescription('Type edits you would like to apply followed by their parameters\n\nFor all edits and arguments, please refer to www.npmjs.com/package/jimp#methods')
				.setFooter('powered by jimp');
			this.message.reply({ embeds: [startEmbed], allowedMentions: { repliedUser: false } }).then(async newMessage =>{
				const filter = m => m.author.id == this.message.author.id && startImage[m.content.toLowerCase().split(' ')[0]] != null;
				const collector = this.message.channel.createMessageCollector({ filter, time: 30 * 1000 });

				collector.on('collect', async m => {
					const image = await Jimp.read(url);
					let args = m.content.split(' ').splice(1, m.content.split(' ').length - 1);
					args = args.map(arg => JSON.parse(arg));
					image[m.content.split(' ')[0]](...args);
					await fsp.unlink(imagePath);
					await image.writeAsync(imagePath);
					color = (await getColors(imagePath)).map(clr => clr.hex())[0];
					await newMessage.removeAttachments();
					const file = new this.Discord.MessageAttachment(imagePath, `edit${editIterations}.png`);
					const modifyEmbed = startEmbed;
					modifyEmbed.setImage(`attachment://edit${editIterations}.png`);
					modifyEmbed.setColor(color);
					newMessage.edit({ embeds:[modifyEmbed], files:[file] });
					url = imagePath;
					collector.resetTimer();
					editIterations = editIterations + 1;
				});

				collector.on('end', async () => {
					await newMessage.removeAttachments();
					const file = new this.Discord.MessageAttachment(imagePath);
					const endEmbed = startEmbed;
					endEmbed.setTitle('*Tadah!* ✨  Here\'s your Image');
					endEmbed.setImage('attachment://imageEdit.png');
					endEmbed.setDescription('How well did we do? Let us know!');
					endEmbed.setColor(color);
					newMessage.edit({ embeds:[endEmbed], files:[file] });
				});
			});
		}
	},
};
