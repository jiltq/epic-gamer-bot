const querystring = require('querystring');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('qrcreate')
		.setDescription('create a qr code')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('text to turn into a qr code')
				.setRequired(true)),
	async execute(interaction) {
		const query = querystring.stringify({ data: interaction.options.getString('text') });
		const embed = new Discord.MessageEmbed()
			.setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&${query}`)
			.setFooter('powered by goqr.me');
		interaction.reply({ embeds: [embed] });
	},
};
