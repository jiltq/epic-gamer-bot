const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Jimp = require('jimp');
const fs = require('fs');
const { clamp } = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('compress')
		.setDescription('compress an image')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('image url')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('percent')
				.setDescription('how much to compress the image')
				.setRequired(false)),
	async execute(interaction) {
		const id = Math.random().toString();
		fs.writeFileSync(`${process.cwd()}/image-editing/${id}.jpg`, '');
		(await Jimp.read(interaction.options.getString('url')))
			.quality(clamp(100 - (interaction.options.getInteger('percent') || 99), 1, 100))
			.write(`${process.cwd()}/image-editing/${id}.jpg`);
		const file = new Discord.MessageAttachment(`${process.cwd()}/image-editing/${id}.jpg`);
		const embed = new Discord.MessageEmbed()
			.setColor('#2f3136')
			.setTitle('2007 gmod compression activated')
			.setImage(`attachment://${id}.jpg`);
		await interaction.reply({ embeds: [embed], files: [file] });
		fs.unlinkSync(`${process.cwd()}/image-editing/${id}.jpg`);
	},
};
