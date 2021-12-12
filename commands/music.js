const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Spotify = new (require('../spotifyHelper.js'))();
const yts = require('yt-search');
const querystring = require('querystring');
const Voice = new (require('../voiceHelper.js'))();
const utility = require('../utility.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

Object.byString = function(o, s) {
	s = s.replace(/\[(\w+)\]/g, '.$1');
	s = s.replace(/^\./, '');
	const a = s.split('.');
	for (let i = 0, n = a.length; i < n; ++i) {
		const k = a[i];
		if (k in o) {
			o = o[k];
		}
		else {
			return;
		}
	}
	return o;
};

function createEmbed(type, content) {
	switch(type) {
	case 'song':
		return new Discord.MessageEmbed()
			.setAuthor('song suggestions - egb music', 'attachment://music_icon.png')
			.setTitle(content.name)
			.setDescription(content.artists.map(_artist => _artist.name).join('\n') || 'N/A')
			.setThumbnail(content.album.images[0].url)
			.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
	case 'artist':
		return new Discord.MessageEmbed()
			.setAuthor('artist suggestions - egb music', 'attachment://music_icon.png')
			.setTitle(content.name)
			.addField('genres', content.genres.join('\n') || 'N/A')
			.setThumbnail(content.images[0].url)
			.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
	case 'home':
		return new Discord.MessageEmbed()
			.setAuthor('egb music', 'attachment://music_icon.png')
			.setTitle(`good ${content.partOfDay}, ${content.user.username}`)
			.setColor(content.member.displayHexColor || '#5865F2')
			.setDescription(`"${utility.random(content.randomDesc)}"`)
			.setThumbnail(content.user.avatarURL())
			.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
	case 'search':
		return new Discord.MessageEmbed()
			.setAuthor('search - egb music', 'attachment://music_icon.png')
			.setTitle(content.name)
			.setDescription(content.artists.map(_artist => _artist.name).join('\n'))
			.setThumbnail(content.album.images[0].url)
			.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('find and play music'),
	async execute(interaction) {
		await interaction.deferReply();
		const musicIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/music_icon.png`);
		const Json = new (require('../jsonHelper.js'))(`${process.cwd()}/JSON/songSuggestions.json`);

		const selectRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'home',
							value: 'home_menu',
							emoji: '<:home_icon:909516650615803954>',
						},
						{
							label: 'suggested songs',
							value: 'song_menu',
							emoji: '<:song_icon:909519670799892490>',
						},
						{
							label: 'suggested artists',
							value: 'artist_menu',
							emoji: '<:person_icon:909518878202265621>',
						},
						{
							label: 'search',
							value: 'search',
							emoji: '<:search_icon:909545310676746262>',
						},
					]),
			);

		const randomDesc = ['curated for you!'];
		const hour = new Date().getHours();
		const partOfDay = hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening');

		let data = await Json.read();
		let userData = data.users[interaction.user.id] || { artists: [], tracks: [] };
		data.users[interaction.user.id] = userData;
		await Json.write(data);
		let artist = userData.artists.slice(-1);
		const artistRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('artist_back')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomId('artist_next')
					.setEmoji('▶️')
					.setStyle('PRIMARY'),
			);
		const songRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('song_back')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomId('song_play')
					.setEmoji('<:egb_headphones:899358911759519846>')
					.setStyle('SECONDARY'),
				new Discord.MessageButton()
					.setCustomId('song_next')
					.setEmoji('▶️')
					.setStyle('PRIMARY'),
			);
		const searchRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('search_back')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomId('search_play')
					.setEmoji('<:egb_headphones:899358911759519846>')
					.setStyle('SECONDARY'),
				new Discord.MessageButton()
					.setCustomId('search_next')
					.setEmoji('▶️')
					.setStyle('PRIMARY'),
			);
		const indexes = {
			song: 0,
			artist: 0,
			home: 0,
			search: 0,
		};
		const selected = {
			song: null,
			artist: null,
			search: null,
		};
		const sets = {
			song: null,
			artist: null,
			home: null,
			search: null,
		};
		const rows = {
			song: [selectRow, songRow],
			artist: [selectRow, artistRow],
			home: [selectRow],
			search: [selectRow, searchRow],
		};
		const setAdvanced = {
			song: 'tracks',
			artist: 'artists',
			home: 'content',
			search: 'tracks.items',
		};
		let searchCollector = null;
		sets.home = {
			'content': [
				{
					user: interaction.user,
					member: interaction.member,
					partOfDay: partOfDay,
					randomDesc: randomDesc,
				},
			],
		};
		await interaction.deleteReply();
		const response = await interaction.followUp({ embeds: [createEmbed('home', sets.home.content[0])], components: rows.home, files: [musicIcon], ephemeral: true });

		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.message.id == response.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: (5 * 60) * 1000 });
		collector.on('collect', async i => {
			collector.resetTimer();
			if (i.customId == 'select') {
				if (searchCollector) searchCollector.stop();
				if (i.values[0].endsWith('menu')) {
					const prefix = i.values[0].split('_')[0];
					if (prefix == 'song' || prefix == 'artist') {
						if (userData.artists.length == 0 || userData.tracks.length == 0) return;
						data = await Json.read();
						userData = data.users[interaction.user.id];
						data.users[interaction.user.id] = userData;
						artist = userData.artists.slice(-1);
						sets.song = await Spotify.getSuggestions(interaction.user.id);
						sets.artist = await Spotify.fetch(`https://api.spotify.com/v1/artists/${artist}/related-artists`, {});
						rows[prefix][rows[prefix].length - 1].components[0].setDisabled(indexes[prefix] == 0);
						rows[prefix][rows[prefix].length - 1].components[rows[prefix][rows[prefix].length - 1].components.length - 1].setDisabled(indexes[prefix] == (sets[prefix].length - 1));
					}
					selected[prefix] = (Object.byString(sets[prefix], setAdvanced[prefix]))[indexes[prefix]];
					await i.update({ embeds: [createEmbed(prefix, selected[prefix])], components: rows[prefix] });
				}
				if (i.values[0] == 'search') {
					const searchEmbed = new Discord.MessageEmbed()
						.setAuthor('search - egb music', 'attachment://music_icon.png')
						.setTitle('send your search query in a message..')
						.setFooter('powered by Spotify', 'https://www.google.com/s2/favicons?domain=open.spotify.com');
					await i.update({ embeds: [searchEmbed], components: [selectRow] });
					const searchFilter = m => m.user.id == i.user.id;

					searchCollector = interaction.channel.createMessageCollector({ searchFilter, time: 30 * 1000 });

					searchCollector.on('collect', async m => {
						await m.delete();
						searchCollector.stop();
						const query = querystring.stringify({ q: m.content, type: 'track' });
						sets.search = await Spotify.fetch(`https://api.spotify.com/v1/search?${query}`);
						selected.search = Object.byString(sets['search'], `${setAdvanced['search']}[${[indexes['search']]}]`);
						rows['search'][rows['search'].length - 1].components[0].setDisabled(indexes['search'] == 0);
						rows['search'][rows['search'].length - 1].components[rows['search'][1].components.length - 1].setDisabled(indexes['search'] == (Object.byString(sets['search'], setAdvanced['search']).length - 1));
						await i.editReply({ embeds: [createEmbed('search', selected.search)], components: rows.search });
					});
				}
			}
			if (i.customId.endsWith('play')) {
				const prefix = i.customId.split('_')[0];
				const connection = Voice.joinVC(interaction);
				const video = (await yts(`${selected[prefix].artists[0].name} - ${selected[prefix].name}`)).videos[0];
				const download = Voice.download(video.url);
				const player = Voice.play(connection, download);
				const controlPanel = Voice.createControlPanel();
				const response2 = await interaction.followUp({ embeds: [createEmbed(prefix, selected[prefix])], components: controlPanel, files: [musicIcon], ephemeral: false });
				Voice.idkControlPanel(interaction, controlPanel, { response: response2, player: player, resource: download });
				userData.artists = [...userData.artists, ...selected[prefix].artists.map(_artist => _artist.id)];
				userData.tracks = [...userData.tracks, selected[prefix].id];
				data.users[interaction.user.id] = userData;
				await Json.write(data);
				player.on(AudioPlayerStatus.Idle, async () => await response2.delete());
			}
			if (i.customId.endsWith('next')) {
				const prefix = i.customId.split('_')[0];
				indexes[prefix]++;
				rows[prefix][rows[prefix].length - 1].components[0].setDisabled(indexes[prefix] == 0);
				rows[prefix][rows[prefix].length - 1].components[rows[prefix][1].components.length - 1].setDisabled(indexes[prefix] == (Object.byString(sets[prefix], setAdvanced[prefix]).length - 1));
				selected[prefix] = Object.byString(sets[prefix], `${setAdvanced[prefix]}[${[indexes[prefix]]}]`);
				await i.update({ embeds: [createEmbed(prefix, selected[prefix])], components: rows[prefix] });
			}
			if (i.customId.endsWith('back')) {
				const prefix = i.customId.split('_')[0];
				indexes[prefix]--;
				rows[prefix][rows[prefix].length - 1].components[0].setDisabled(indexes[prefix] == 0);
				rows[prefix][rows[prefix].length - 1].components[rows[prefix][1].components.length - 1].setDisabled(indexes[prefix] == (Object.byString(sets[prefix], setAdvanced[prefix]).length - 1));
				selected[prefix] = Object.byString(sets[prefix], `${setAdvanced[prefix]}[${[indexes[prefix]]}]`);
				await i.update({ embeds: [createEmbed(prefix, selected[prefix])], components: rows[prefix] });
			}
		});
	},
};
