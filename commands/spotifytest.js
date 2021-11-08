const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const querystring = require('querystring');
const Spotify = new (require('../spotifyHelper.js'))();
const Json = new (require('../jsonHelper.js'))('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/JSON/songSuggestions.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spotifytest')
		.setDescription('cool')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('query')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('type')
				.addChoice('song', 'track')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const query = querystring.stringify({ q: interaction.options.getString('query'), type: interaction.options.getString('type') });
		const results = await Spotify.fetch(`https://api.spotify.com/v1/search?${query}`, {
			method: 'get',
		});
		const song = results.tracks.items[0];
		const songData = await Spotify.fetch(`https://api.spotify.com/v1/audio-features/${song.id}`, {
			method: 'get',
		});
		const artistData = await Spotify.fetch(`https://api.spotify.com/v1/artists/${song.artists[0].id}`, {
			method: 'get',
		});
		console.log(songData);
		console.log(artistData);
		const suggestQuery = querystring.stringify({ seed_artists: song.artists.map(artist => artist.id).slice(4).join(','), seed_genres: artistData.genres.slice(4).join(','), seed_tracks: song.id.toString() });
		const suggestData = await Spotify.fetch(`https://api.spotify.com/v1/recommendations/?${suggestQuery}`, {
			method: 'get',
		});
		console.log(suggestData);

		const prevData = await Json.read();
		const prevUserData = prevData.users[interaction.user.id] || {
			artists: [

			],
			genres: [

			],
			tracks: [

			],
		};
		prevUserData.artists = [...prevUserData.artists, ...song.artists.map(artist => artist.id)];
		prevUserData.genres = [...prevUserData.genres, ...artistData.genres];
		prevUserData.tracks = [...prevUserData.tracks, song.id];

		prevData.users[interaction.user.id] = prevUserData;
		await Json.write(prevData);

		const embed = new Discord.MessageEmbed()
			.setAuthor(song.artists[0].name)
			.setTitle(song.name);
		await interaction.editReply({ embeds: [embed] });
	},
};
