const yts = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('youtube')
		.setDescription('search youtube')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('what to search')
				.setRequired(true)),
	defer: true,
	async execute(interaction) {
		const r = await yts(interaction.options.getString('query'));
		const url = r.videos[0].url;
		interaction.editReply(url);
	},
};
