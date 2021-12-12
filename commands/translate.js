const translate = require('@vitalets/google-translate-api');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const languages = require('../node_modules/@vitalets/google-translate-api/languages.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('translate text to or from another language')
		.addStringOption(option =>
			option
				.setName('text')
				.setDescription('text to translate')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('to')
				.setDescription('language to translate to')
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName('from')
				.setDescription('language to translate from')
				.setRequired(false),
		),
	async execute(interaction) {
		const from = languages.getCode(interaction.options.getString('from')) || 'auto';
		const to = languages.getCode(interaction.options.getString('to')) || 'en';
		const res = await translate(trim(interaction.options.getString('text'), 5000), { from: from, to: to });
		const embed = new Discord.MessageEmbed()
			.setAuthor('google translate', 'https://www.google.com/s2/favicons?domain_url=translate.google.com', 'https://translate.google.com')
			.addField(`:flag_${res.from.language.iso == 'en' ? 'us' : res.from.language.iso}: ${languages[res.from.language.iso]}`, trim(res.from.text.value || interaction.options.getString('text'), 1024), true)
			.addField(`:flag_${to == 'en' ? 'us' : to}: ${languages[to]}`, trim(res.text, 1024), true);
		interaction.reply({ embeds: [embed] });
	},
};
