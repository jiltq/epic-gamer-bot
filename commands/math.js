const Discord = require('discord.js');
const parser = require('mathjs').parser();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('math')
		.setDescription('calculate expressions')
		.addStringOption(option =>
			option.setName('expression')
				.setDescription('math expression')
				.setRequired(true)),
	async execute(interaction) {
		const file = new Discord.MessageAttachment(`${process.cwd()}/assets/calculate_icon.png`);
		const embed = new Discord.MessageEmbed()
			.setAuthor('calculator', 'attachment://calculate_icon.png')
			.setTitle(`${interaction.options.getString('expression')} = ${parser.evaluate(interaction.options.getString('expression'))}`)
			.setFooter('powered by mathjs');
		interaction.reply({ embeds: [embed], files: [file], ephemeral: true });
	},
};
