const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const { getFavicon, embedColors } = require('../Decor.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription('consult the urban dictionary for knowledge')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('term to search up')
				.setRequired(true)),
	async execute(interaction) {
		const query = Web.createQuery({ term: interaction.options.getString('term') });

		const { list } = await Web.fetch(`https://api.urbandictionary.com/v0/define?${query}`);
		if (!list.length) {
			throw new Error('no results found!');
		}

		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		const [answer] = list;

		const embed = new Discord.MessageEmbed()
			.setAuthor('urban dictionary', getFavicon('https://www.urbandictionary.com'), 'https://www.urbandictionary.com')
			.setTitle(answer.word)
			.setColor(embedColors.default)
			.setURL(answer.permalink)
			.setDescription(trim(answer.definition || 'error: definition not available', 2048).replace(/\[(.*?)\]/g, '$1'));
		if (answer.thumbs_up && answer.thumbs_down) embed.setFooter(`👍 ${Math.round((answer.thumbs_up / (answer.thumbs_up + answer.thumbs_down)) * 100)}%`);
		if (trim(answer.example, 1024)) {
			embed.addField('example', trim(answer.example, 1024).replace(/\[(.*?)\]/g, '$1'));
		}
		interaction.reply({ embeds: [embed] });
	},
};
