const Canvas = require('canvas');
const Discord = require('discord.js');

let textArray = [];

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 100;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - (canvas.width / 2));

	// Return the result to use in the actual canvas
	return context.font;
};

const splitText = (canvas, text) =>{
	const context = canvas.getContext('2d');
	context.font = '70px sans-serif';
	const size_per_letter = context.measureText(text).width / text.length;
	const array = text.split('');
	let go_on = true;
	array.forEach((letter, index) =>{
		if (go_on) {
			const size = (index + 1) * size_per_letter;
			if (size > canvas.width - (canvas.width / 2)) {
				textArray.push(text.substring(0, index));
				if (text.substring(index).length >= text.substring(0, index).length) {
					splitText(canvas, text.substring(index));
				}
				else {
					textArray.push(text.substring(index));
				}
				go_on = false;
			}
			else if (context.measureText(text).width < canvas.width - (canvas.width / 2)) {
				textArray.push(text);
				go_on = false;
			}
		}
	});
};

module.exports = {
	name: 'sonicsays',
	description: 'make sonic say something',
	usage: '[text for sonic to say]',
	args: true,
	async execute(message, args) {
		const text = args[0];

		const canvas = Canvas.createCanvas(1190, 648);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/sonicsays.jpg');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		splitText(canvas, text);
		context.font = '70px sans-serif';
		context.fillStyle = '#ffffff';
		const maxHeight = canvas.height / 1.1;
		const minHeight = canvas.height / 3.25;
		const dividedHeight = (maxHeight - minHeight) / textArray.length;
		textArray.forEach((splittext, index) =>{
			let modifiedIndex;
			if (index == 0) {
				modifiedIndex = 0;
			}
			else {
				modifiedIndex = index;
			}
			context.fillText(splittext, canvas.width / 20, minHeight + (dividedHeight * modifiedIndex));
		});
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sonic-says.jpg');

		const embed = new Discord.MessageEmbed()
			.setImage('attachment://sonic-says.jpg');
		message.reply({ files: [attachment], embeds: [embed], allowedMentions: { repliedUser: false } });
		textArray = [];
	},
};
