const Discord = require('discord.js');
const { JSDOM } = require('jsdom');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { getFavicon } = require('../utility.js');

function fixString4Field(input) {
	const { window } = new JSDOM('');
	const $ = require('jquery')(window);
	const fixed = $('<div/>').html(input).text();
	return trim(fixed, 1024);
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('get information about a game on steam')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the game')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const lol = await Web.fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
		const { appid } = lol.applist.apps.find(app => app.name.toLowerCase() == interaction.options.getString('name').toLowerCase());

		const result = await Web.fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);

		const data = result[appid].data;

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'steam', url: 'https://store.steampowered.com', iconURL: getFavicon('https://store.steampowered.com') })
			.setTitle(data.name)
			.setURL(`https://store.steampowered.com/app/${appid}`)
			.setColor('#2f3136');

		if (data.header_image) embed.setImage(data.header_image);
		if (data.metacritic) embed.setFooter({ text: `metacritic score: ${data.metacritic.score}` });
		if (data.about_the_game) embed.addField('about the game', fixString4Field(data.about_the_game));
		if (data.reviews) embed.addField('reviews', fixString4Field(data.reviews), true);
		if (data.pc_requirements) embed.addField('pc requirements', fixString4Field(data.pc_requirements.minimum), true);
		interaction.editReply({ embeds: [embed], ephemeral: true });
	},
};
