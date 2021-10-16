const math = require('mathjs');
const Discord = require('discord.js');
const parser = math.parser();
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
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${interaction.options.getString('expression')}`)
			.setTitle(`**${parser.evaluate(interaction.options.getString('expression'))}**`)
			.setFooter('powered by mathjs');
		interaction.editReply({ embeds: [embed] });
	},
};
