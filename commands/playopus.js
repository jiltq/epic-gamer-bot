const Discord = require('discord.js');
const yts = require('yt-search');
const ytpl = require('ytpl');
const embedHelper = require('../embedHelper');
const audioHelper = require('../audioHelper');
const config = require('../config.json');

const dispatcherModule = require('../databases/dispatcher');

let playlist;

let ping_warn = false;

let playingMusic = false;

const debug = true;
const volumeLimit = 70;
const loopCooldown = 5000;

// Embed Helpers
const warningEmbed = new embedHelper.WarningEmbed(Discord);
const errorEmbed = new embedHelper.ErrorEmbed(Discord);
const videoEmbed = new embedHelper.playOpusEmbeds.VideoEmbed(Discord);

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const AudioHelper = new audioHelper.AudioHelper('opus');

// JSON
const favoriteSongs = require('../JSON/favoriteSongs.json');

/*
class VideoEmbed {
	constructor(video, voiceChannel, message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor('now playing..')
			.setTitle(video.title)
			.setDescription(trim(`**by ${video.author.name}**`, 2048))
			.setImage(video.thumbnail || '')
			.setFooter(`in channel: ${voiceChannel.name || 'VOICE CHANNEL NAME'}, requested by: ${message.member.user.username || 'USERNAME'}`);
		if (video.title == message.client.user.presence.activities[0].name) {
			embed.setColor('GOLD');
		}
		this.embed = embed;
	}
}
*/
class PlaylistEmbed {
	constructor(playlistB, voiceChannel, message, rawPlaylist) {
		const embed = new Discord.MessageEmbed()
			.setAuthor('now playing..')
			.setTitle(playlistB.title)
			.setDescription(`**by ${playlistB.author.name}**`)
			.setImage(rawPlaylist.thumbnail || '')
			.setFooter(`in channel: ${voiceChannel.name || 'VOICE CHANNEL NAME'}, requested by: ${message.member.user.username || 'USERNAME'}`);
		this.embed = embed;
	}
}

module.exports = {
	name: 'play',
	description: 'Play a YouTube video',
	usage: '[video name, volume]',
	category: 'music',
	args: true,
	async execute(message, args, IPM, client) {
		ping_warn = true;
		play(false, parseFloat(args[1] || '1'), true, 0);
		async function play(looped, volume, isPlaylist, playlistIndex) {
			const voiceChannel = message.member.voice.channel;

			// Initial logic checks
			if (!voiceChannel) {
				const embed = await errorEmbed.create('you are not connected to a voice channel!', 'please connect to a voice channel to continue');
				return message.channel.send({ embeds:[embed] });
			}

			// Find video or playlist
			const r = await yts(args.join(' '));
			const videos = r.videos;
			let v = r.videos[0];
			const p = r.playlists[0];

			// Check to see if there is a video under 3 hours
			let go_on = true;
			videos.forEach(function(video) {
				if (go_on == true) {
					if (parseInt(video.duration.toString().split('seconds')[0]) < 10800) {
						v = video;
						go_on = false;
						return;
					}
				}
				else {
					return;
				}
			});
			if (v) {
				if (parseInt(v.duration.toString().split('seconds')[0]) > 10800) {
					const embed = await errorEmbed.create('video is over 3 hours!', 'please provide a shorter video');
					return message.channel.send({ embeds: [embed]});
				}
			}

			// Is there even a video?
			if (!v && !looped && !p) {
				const embed = await errorEmbed.create('no results found!', 'check your spelling or try different keywords');
				return message.channel.send({ embeds: [embed] });
			}
			else if (p && !v && !looped) {
				const list = await ytpl(p.listId);
				playlist = list;
			}
			/*
			const refineVideo = new Promise((resolve, reject) => {
				if (videos.length > 1) {
					const newmsg = message.channel.send('it seems like this video has a lot of search results, would you like to refine your search query? react to this message with :white_check_mark: to refine');
					const reactionFilter = (reaction, user) => {
						return reaction.emoji.name === ':white_check_mark:' && user.id === message.author.id;
					};

					const reactionCollector = newmsg.createReactionCollector(reactionFilter, { time: 15000 });

					reactionCollector.on('collect', (reaction, user) => {
						reactionCollector.end();
						const filter = m => m.author == user;
						const collector = message.channel.createMessageCollector(filter, { time: 15000 });

						collector.on('collect', m => {
							collector.end();
							message.channel.send('ok theres supposed to be something here');
							resolve(true);
						});

						collector.on('end', collected => {
							console.log(`Collected ${collected.size} items`);
						});
					});

					reactionCollector.on('end', collected => {
						console.log(`Collected ${collected.size} items`);
					});
				}
				else {
					resolve(false);
				}
			});
			await refineVideo.then(output =>{
				console.log(`promise output: ${output}`);
			});
			*/
			voiceChannel.join().then(async connection => {
				/*
					Default values

					highwatermark: 12
					bitrate: 96
				*/
				/*
				let highwatermark;
				if (v) highwatermark = 12 + (Math.round(12 * (parseInt(v.duration.toString().split('seconds')[0])) / 60));
				const bitrate = 'auto';
				*/
				let dispatcher;
				if (v) dispatcher = connection.play(await AudioHelper.create(v.url), { type: 'opus' });
				else if (p) dispatcher = connection.play(await AudioHelper.create(playlist.items[playlistIndex].url), { type: 'opus' });
				dispatcher.on('start', async () =>{
					playingMusic = true;
					dispatcher.setVolume(volume);
					if (!looped && v) {
						const embed = await videoEmbed.create(v, voiceChannel, message);
						message.channel.send({embeds:[embed]});
					}
					if (!looped && !v && p && playlistIndex <= 0) {
						const playlistEmbed = new PlaylistEmbed(playlist, voiceChannel, message, p);
						message.channel.send({embeds:[playlistEmbed.embed]});
					}
				});
				dispatcher.setVolume(volume);
				dispatcherModule.update(dispatcher);
				// IPM.write_database_data('dispatcher', 'dispatcher', dispatcher, message.client, message.guild);
				dispatcher.on('finish', async () =>{
					playingMusic = false;
					if (dispatcherModule.getLooped()) {
						setTimeout(function() {
							play(true, dispatcherModule.getVolume());
						}, loopCooldown);
					}
					if (p && playlist) {
						if ((playlistIndex + 1) <= playlist.items.length) {
							setTimeout(function() {
								play(false, dispatcherModule.getVolume(), true, playlistIndex + 1);
							}, loopCooldown);
						}
					}
				});
				connection.on('debug', async debug_message =>{
					if (debug) console.log(`Client ${client.shardID}: ${debug_message}`);
					const oldAvgRaw = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/averagePing.json');
					const oldAvg = oldAvgRaw.ping;
					const newAvg = (oldAvg + client.ws.ping) / 2;
					IPM.edit_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/averagePing.json', 'ping', newAvg);
					if (Math.abs(client.ws.ping - oldAvg) > (oldAvg * (3 / 4))) {
						if (ping_warn) {
							const embed = new Discord.MessageEmbed()
								.setAuthor(`${config.username} is currently experiencing unstable websocket ping, so you may encounter low-quality audio`)
								.setDescription(`Ping difference: ${Math.round(Math.abs(client.ws.ping - oldAvg))}ms\nDesired maximum ping difference: ${Math.round((oldAvg * (3 / 4)))}ms`)
								.setFooter('please be patient while we attempt to fix this issue');
							message.channel.send({embeds:[embed]});
							ping_warn = false;
						}
					}
					if (playingMusic) {
						/*
						let isPositive;
						if (oldAvg < newAvg) isPositive = false;
						if (newAvg > oldAvg) isPositive = true;
						let newBitrate;
						if (isPositive) {
							newBitrate = voiceChannel.bitrate + (voiceChannel.bitrate * (Math.abs((oldAvg - newAvg)) / ((oldAvg + newAvg) / 2)));
						}
						else {
							newBitrate = voiceChannel.bitrate - (voiceChannel.bitrate * (Math.abs((oldAvg - newAvg)) / ((oldAvg + newAvg) / 2)));
						}
						dispatcher.setBitrate(newBitrate);
						console.log(newBitrate);
						console.log(((oldAvg - newAvg) / ((oldAvg + newAvg) / 2)));
						// dispatcher.setPLP((newAvg - oldAvg) / newAvg);
						*/
						if (dispatcher.volumeDecibels >= volumeLimit) {
							dispatcher.setVolume(1);
							const embed = await warningEmbed.create('Woah, dude! Too loud!!', 'To comply with the WHO noise exposure level recommendations, the volume has been reduced automatically');
							return message.channel.send({embeds:[embed]});
						}
					}
				});
				connection.on('warn', async warning =>{
					console.log(warning);
				});
				connection.on('error', async error =>{
					IPM.execute_internal_command('commanderror', { 'client': client, 'error': error, 'message': message });
				});
			});
		}
	},
};
