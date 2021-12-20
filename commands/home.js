const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Json = require('../jsonHelper.js');
const Spotify = new (require('../spotifyHelper.js'))();

// Settings
const locale = 'en-US';
const maxPerSection = 5;
const homeIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/home_icon.png`);
const errorIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/error_icon.png`);

const typeReformat = {
	PLAYING: 'playing',
	STREAMING: 'streaming',
	LISTENING: 'listening to',
	WATCHING: 'watching',
	CUSTOM: '',
	COMPETING: 'competing in',
};

const statusFormat = {
	online: {
		value: 3,
		emoji: '🟢',
	},
	idle: {
		value: 2,
		emoji: '🌙',
	},
	dnd: {
		value: 1,
		emoji: '🔴',
	},
	offline: {
		value: 0,
		emoji: '💤',
	},
};

function getShortStatus(presence) {
	if (!presence) return null;
	if (presence.activities.length == 0) return null;
	const activity = presence.activities.filter(act => act.type != 'CUSTOM')[0];
	if (!activity) return null;
	return `${typeReformat[activity.type]} **${activity.name}**`;
}

const fieldTypes = [
	{
		name: 'following',
		emoji: '👥',
	},
	{
		name: 'upcoming today',
		emoji: '📆',
	},
	{
		name: 'music for you',
		emoji: '🎶',
		poweredBy: 'Spotify',
	},
	{
		name: 'weather',
		emoji: '⛅',
		poweredBy: 'HERE Technologies',
	},
	{
		name: 'mutual gamers',
		emoji: '🎮',
	},
];

function createErrorEmbed(errorTitle, errorDesc = null) {
	const embed = new Discord.MessageEmbed()
		.setAuthor('error', 'attachment://error_icon.png')
		.setTitle(errorTitle)
		.setColor('#ED4245');
	if (errorDesc) embed.setDescription(errorDesc);
	return embed;
}

const fieldMethods = {
	'following': async function(interaction, userData) {
		const following = userData.following;
		const followingMembers = [];

		for (let i = 0;i < following.length;i++) {
			const fetched = await interaction.guild.members.fetch(following[i]);
			followingMembers[i] = fetched;
		}
		followingMembers.sort(function(a, b) {
			const presence0 = a.presence || { status: 'offline', activities: [] };
			const presence1 = b.presence || { status: 'offline', activities: [] };
			return (statusFormat[presence1.status].value + presence1.activities.filter(act => act.type != 'CUSTOM').length) - (statusFormat[presence0.status].value + presence0.activities.filter(act => act.type != 'CUSTOM').length);
		});
		return followingMembers.slice(0, maxPerSection).map(member => `${statusFormat[member.presence ? member.presence.status : 'offline'].emoji} **${member.toString()}**${getShortStatus(member.presence) ? `: ${getShortStatus(member.presence)}` : ''}`).join('\n\n') || 'nobody yet! follow a member using /follow';
	},
	'upcoming today': async function(interaction, userData) {
		return `**${new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**`;
	},
	'music for you': async function(interaction, userData) {
		const songSuggestions = await Spotify.getSuggestions(interaction.user.id);
		return songSuggestions.tracks.length != 0 ? songSuggestions.tracks.slice(0, maxPerSection).map(suggestion => `**${suggestion.name}**\n${suggestion.artists.map(_artist => _artist.name).join(', ')}`).join('\n\n') : 'none yet! get started by using /play';
	},
	'weather': async function(interaction, userData) {
		return 'this isnt done yet sorry xd';
	},
	'mutual gamers': async function(interaction, userData) {
		const userData2Json = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData2 = await userData2Json.read();

		const yourGames = userData2.users[interaction.user.id].games;

		let mutuals = [];

		for (let i = 0;i < yourGames.length;i++) {
			const game = yourGames[i];
			const mutual = Object.entries(userData2.users).filter(user => user[0] != interaction.user.id).filter(user => user[1].games.find(_game => _game.name == game.name));
			mutuals.push(...mutual);
		}
		mutuals = mutuals.filter(mutual => mutual.length > 0).map(mutual =>{ return { 'id': mutual[0], 'games': mutual[1].games.filter(_game => yourGames.find($game => $game.name == _game.name)) }; });

		const mutualMembers = {};

		for (let i = 0;i < mutuals.length;i++) {
			const fetched = await interaction.guild.members.fetch(mutuals[i].id);
			mutualMembers[mutuals[i].id] = fetched;
		}

		return mutuals.slice(0, maxPerSection).map(mutual => `${mutualMembers[mutual.id].user.toString()}\n${mutual.games.map(game => `• \`${game.name}\` - played **${game.timesPlayed}** time${game.timesPlayed > 1 ? 's' : ''}`).join('\n')}`).join('\n\n');
	},
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('home')
		.setDescription('the main hub for all things epic gamer bot')
		.addSubCommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('view your home screen'))
		.addSubCommand(subcommand =>
			subcommand
				.setName('add-field')
				.setDescription('add a field to your home screen')
				.addStringOption(option =>
					option
						.setName('type')
						.setDescription('type of field to add')
						.setRequired(true)
						.addChoices(fieldTypes.map((fieldType, index) => [`${fieldType.emoji} ${fieldType.name}`, `fieldtype_${index}`])),
				))
		.addSubCommand(subcommand =>
			subcommand
				.setName('remove-field')
				.setDescription('remove a field from your home screen')
				.addStringOption(option =>
					option
						.setName('type')
						.setDescription('type of field to remove')
						.setRequired(true)
						.addChoices(fieldTypes.map((fieldType, index) => [`${fieldType.emoji} ${fieldType.name}`, `fieldtype_${index}`])),
				),

		),
	async execute(interaction) {
		const settingsJson = new Json(`${process.cwd()}/JSON/userSettings.json`);
		const settingsData = await settingsJson.read();

		if (!settingsData.users[interaction.user.id]) {
			settingsData.users[interaction.user.id] = settingsData.template;
		}
		const userData = settingsData.users[interaction.user.id];

		if (interaction.options.getSubcommand() == 'add-field') {
			if (userData.homeLayout.includes(interaction.options.getString('type'))) {
				const field = fieldTypes[interaction.options.getString('type').split('_')[1]];
				return interaction.reply({ embeds: [createErrorEmbed(`you already have a field with type \`${field.emoji} ${field.name}\`!`)], files: [errorIcon], ephemeral: true });
			}
			if (userData.homeLayout.length == 25) {
				return interaction.reply({ embeds: [createErrorEmbed('you have too many fields!', 'you may have a maximum of 25 fields')], files: [errorIcon], ephemeral: true });
			}
			userData.homeLayout.push(interaction.options.getString('type'));
		}
		else if (interaction.options.getSubcommand() == 'remove-field') {
			if (!userData.homeLayout.includes(interaction.options.getString('type'))) {
				const field = fieldTypes[interaction.options.getString('type').split('_')[1]];
				return interaction.reply({ embeds: [createErrorEmbed(`you dont have a field with type \`${field.emoji} ${field.name}\`!`)], files: [errorIcon], ephemeral: true });
			}
			userData.homeLayout = userData.homeLayout.filter(field => field != interaction.options.getString('type'));
		}

		const date = new Date();

		const homeEmbed = new Discord.MessageEmbed()
			.setAuthor('egb home', 'attachment://home_icon.png')
			.setTitle(`welcome home, ${interaction.user.username}`)
			.setDescription(`:clock${date.toLocaleTimeString(locale).split(':')[0]}${date.getMinutes() >= 30 ? '30' : ''}: ${date.toLocaleTimeString(locale)}`)
			.setThumbnail(interaction.user.avatarURL())
			.setColor('#2f3136');

		for (let i = 0; i < userData.homeLayout.length; i++) {
			const field = fieldTypes[userData.homeLayout[i].split('_')[1]];
			homeEmbed.addField(`${field.emoji} ${field.name}`, await fieldMethods[field.name](interaction, userData), true);
		}
		const homeLayoutFormatted = userData.homeLayout.map(raw => fieldTypes[raw.split('_')[1]]);

		homeEmbed.setFooter(homeLayoutFormatted.filter(field => field.poweredBy).map(field => `${field.emoji} ${field.name} powered by ${field.poweredBy}`).join(' ; '));

		await interaction.reply({ embeds: [homeEmbed], files: [homeIcon], ephemeral: true });
		await settingsJson.write(settingsData);
	},
};
