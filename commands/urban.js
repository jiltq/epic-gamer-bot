const Discord = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription('consult the urban dictionary for knowledge')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('term to search up')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const query = querystring.stringify({ term: interaction.options.getString('term') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list.length) {
			const embed = new Discord.MessageEmbed()
				.setColor('#7F0000')
				.setAuthor('no results found!')
				.setFooter('check your spelling or try different keywords');
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		const [answer] = list;

		const embed = new Discord.MessageEmbed()
			.setAuthor(answer.word, '', answer.permalink)
			.setDescription(trim(answer.definition || 'error: definition not available', 2048).replace(/\[(.*?)\]/g, '$1'));
		if (trim(answer.example, 1024)) {
			embed.addField('Example', trim(answer.example, 1024).replace(/\[(.*?)\]/g, '$1'));
		}
		if (trim(answer.thumbs_up) && trim(answer.thumbs_down)) {
			embed.addField('Rating', `:thumbup:\`${Math.round((answer.thumbs_up / (answer.thumbs_up + answer.thumbs_down)) * 100) }%\` :thumbdown:\`${Math.round((answer.thumbs_down / (answer.thumbs_up + answer.thumbs_down)) * 100) }%\``);
		}
		interaction.editReply({ embeds:[embed] });
	},
};
