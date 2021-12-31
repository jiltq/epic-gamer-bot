const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { randomInt } = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomint')
		.setDescription('get a random integer between two values')
		.addIntegerOption(option =>
			option.setName('min')
				.setDescription('minimum value')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('max')
				.setDescription('maximum value')
				.setRequired(true)),
	async execute(interaction) {
		const min = interaction.options.getInteger('min');
		const max = interaction.options.getInteger('max');
		const result = randomInt(min, max);
		console.log(result);
		const embed = new Discord.MessageEmbed()
			.setColor('#2f3136')
			.setAuthor({ name: `random integer between ${min} and ${max}` })
			.setTitle(`${result}`);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
