const Discord = require('discord.js');
const parser = require('mathjs').parser();
const { SlashCommandBuilder } = require('@discordjs/builders');
const Decor = require('../Decor.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculator')
		.setDescription('calculate expressions')
		.addStringOption(option =>
			option.setName('expression')
				.setDescription('math expression')
				.setRequired(true)),
	async execute(interaction) {
		const file = Decor.getIconAttachment('calculate_icon');
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'calculator', iconURL: 'attachment://calculate_icon.png' })
			.setTitle(`${interaction.options.getString('expression')} = ${parser.evaluate(interaction.options.getString('expression'))}`)
			.setColor(Decor.embedColors.default)
			.setFooter({ text: 'powered by mathjs' });
		await interaction.reply({ embeds: [embed], files: [file] });
	},
};
