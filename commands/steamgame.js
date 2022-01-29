const Discord = require('discord.js');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const { getFavicon } = require('../utility.js');

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
		const { appid } = lol.applist.apps.find(app => app.name == interaction.options.getString('name'));

		const result = await Web.fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);

		const data = result[appid].data;

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'steam', url: 'https://store.steampowered.com', iconURL: getFavicon('https://store.steampowered.com') })
			.setTitle(data.name)
			.setURL(`https://store.steampowered.com/app/${appid}`)
			.setColor('#2f3136')
			.addField('description', trim(data.detailed_description, 1024));

		if (data.header_image) embed.setImage(data.header_image);
		interaction.editReply({ embeds: [embed], ephemeral: true });
	},
};
