const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

const querystring = require('querystring');
const Spotify = new (require('../spotifyHelper.js'))();
const utility = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a youtube video')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of video to play')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('loop')
				.setDescription('whether or not to loop the song')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('private')
				.setDescription('if egb should make the music interface publicly visible')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const Json = new (require('../jsonHelper.js'))('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/JSON/songSuggestions.json');
		const file = new Discord.MessageAttachment('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/music_icon.png');
		const suggestData = await Json.read();
		const suggestUserData = suggestData.users[interaction.user.id] || {
			artists: [],
			tracks: [],
		};
		if (!interaction.options.getString('name')) {
			if (suggestUserData.tracks.length < 1 || suggestUserData.artists.length < 1) {
				const errorEmbed = new Discord.MessageEmbed()
					.setAuthor('music player', 'attachment://music_icon.png')
					.setColor('#ED4245')
					.setTitle('play more songs to receive recommendations!');
				await interaction.deleteReply();
				return await interaction.followUp({ embeds: [errorEmbed], files: [file], ephemeral: true });
			}
			const artists = [];
			const tracks = [];
			[0, 0, 0, 0, 0].forEach(async () =>{
				artists.push(utility.random(utility.removeDupes(suggestUserData.artists)));
				tracks.push(utility.random(utility.removeDupes(suggestUserData.tracks)));
			});
			const suggestQuery = querystring.stringify({
				limit: 12,
				seed_artists: utility.removeDupes(artists).join(','),
				seed_tracks: utility.removeDupes(tracks).join(','),
			});
			const suggestions = await Spotify.fetch(`https://api.spotify.com/v1/recommendations?${suggestQuery}`, {
				method: 'get',
				headers: {
					'Accept': 'application/json',
				},
			});
			const suggestEmbed = new Discord.MessageEmbed()
				.setAuthor('music player', 'attachment://music_icon.png')
				.setTitle('recommended for you')
				.setThumbnail(interaction.user.avatarURL())
				.setColor('#5865F2')
				.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
			suggestions.tracks.forEach(async suggestion =>{
				suggestEmbed.addField(suggestion.name, `${suggestion.artists[0].name}`, true);
			});
			await interaction.deleteReply();
			return await interaction.followUp({ embeds: [suggestEmbed], files: [file], ephemeral: true });
		}
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			selfDeaf: true,
			selfMute: false,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		let volume = 1.0;
		let muted = false;

		const player = createAudioPlayer();
		const pausePlayer = createAudioPlayer();

		connection.subscribe(player);
		player.play(createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/join_vc.wav'));

		const query = querystring.stringify({ q: interaction.options.getString('name'), type: 'track' });
		const results = await Spotify.fetch(`https://api.spotify.com/v1/search?${query}`, {
			method: 'get',
		});
		const song = results.tracks.items[0];
		suggestUserData.artists = utility.removeDupes([...suggestUserData.artists, ...song.artists.map(artist => artist.id)]);
		suggestUserData.tracks = utility.removeDupes([...suggestUserData.tracks, song.id]);
		suggestData.users[interaction.user.id] = suggestUserData;
		await Json.write(suggestData);

		const video = (await yts(`${song.artists[0].name} - ${song.name}`)).videos[0];
		const stream = ytdl(video.url, { filter: 'audioonly' });
		const metadata = await ytdl.getInfo(video.url);
		const seconds = parseFloat(metadata.player_response.videoDetails.lengthSeconds);
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });

		player.play(resource);

		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setEmoji('<:play:899356730750828575>')
					.setCustomId('resume')
					.setDisabled(true)
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setEmoji('<:pause:899357054437834753>')
					.setCustomId('pause')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setEmoji('<:stop:899357930611175524>')
					.setCustomId('stop')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setEmoji('<:egb_loop:899358138849955920>')
					.setCustomId('loop')
					.setStyle('PRIMARY'),
			);
		const row2 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setEmoji('<:volumemute:899370115483721809>')
					.setCustomId('volumemute')
					.setStyle('SECONDARY'),
				new Discord.MessageButton()
					.setEmoji('<:volumedown:899370640421830668>')
					.setCustomId('volumedown')
					.setStyle('SECONDARY'),
				new Discord.MessageButton()
					.setEmoji('<:volumeup:899360001481666610>')
					.setCustomId('volumeup')
					.setStyle('SECONDARY'),
			);
		const embed = new Discord.MessageEmbed()
			.setAuthor('music player', 'attachment://music_icon.png')
			.setColor('#5865F2')
			.setURL(`https://open.spotify.com/track/${song.id}`)
			.setTitle(song.name)
			.setDescription(`**${song.artists[0].name}**`)
			.setImage(video.thumbnail)
			.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
		let response;
		if (interaction.options.getBoolean('private')) {
			if (interaction.member.voice.channel.members.filter(member => !member.user.bot).size > 1) {
				const errorEmbed = new Discord.MessageEmbed()
					.setAuthor('music player', 'attachment://music_icon.png')
					.setColor('#ED4245')
					.setTitle('you must be in a voice channel alone to use private mode!');
				player.play(createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/error.wav'));
				await interaction.deleteReply();
				return await interaction.followUp({ embeds: [errorEmbed], files: [file], ephemeral: true });
			}
			await interaction.deleteReply();
			response = await interaction.followUp({ embeds: [embed], components: [row, row2], files: [file], ephemeral: true });
		}
		else {
			response = await interaction.editReply({ embeds: [embed], components: [row, row2], files: [file] });
		}
		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.message.id == response.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: seconds * 1000 });

		collector.on('collect', async i => {
			switch (i.customId) {
			case 'resume':
				pausePlayer.play(createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/unpause.wav'));
				player.unpause();
				connection.subscribe(player);
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(false);
				break;
			case 'pause':
				connection.subscribe(pausePlayer);
				pausePlayer.play(createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/pause.wav'));
				player.pause();
				row.components[0].setDisabled(false);
				row.components[1].setDisabled(true);
				break;
			case 'stop':
				player.stop();
				for (const component of row.components) {
					component.setDisabled(true);
				}
				for (const component of row2.components) {
					component.setDisabled(true);
				}
				break;
			case 'volumemute':
				resource.volume.setVolume(!muted ? 0.0 : volume);
				muted = !muted;
				row2.components[1].setDisabled(muted || volume == 0.0);
				row2.components[2].setDisabled(muted);
				break;
			case 'volumeup':
				resource.volume.setVolume(volume + 0.5);
				volume = volume + 0.5;
				row2.components[1].setDisabled(volume == 0.0);
				break;
			case 'volumedown':
				resource.volume.setVolume(volume - 0.5);
				volume = volume - 0.5;
				row2.components[1].setDisabled(volume == 0.0);
				break;
			case 'loop':

				break;
			}
			return i.update({ embeds: [embed], components: [row, row2], files: [file] });
		});
		collector.on('end', async () =>{
			for (const component of row.components) {
				component.setDisabled(true);
			}
			for (const component of row2.components) {
				component.setDisabled(true);
			}
			return response.edit({ embeds: [embed], components: [row, row2], files: [file] });
		});
		player.on(AudioPlayerStatus.Idle, () => connection.destroy());
	},
};