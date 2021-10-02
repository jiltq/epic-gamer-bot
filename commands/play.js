// const ytsr = require('ytsr');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
// const ytdl2 = require('@ytdl/ytdl');
const yts = require('yt-search');
const dispatcherModule = require('../databases/dispatcher');
const fs = require('fs');

// let timeout = 1000;
let searchtimeout = 1000;
let messageA;

let warning = false;

let playing_music = false;
/*
async function queue(link, voiceChannel, message) {
	voiceChannel.join().then(async connection => {
		const queueA = fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '');
		message.channel.send('**loading..**');
		const video = await ytdl(link);
		const dispatcher = connection.play(video, { type: 'opus', highWaterMark: 50, quality: 'highestaudio' });

		video.on('end', () =>{
			if (fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0] == null) {
				voiceChannel.leave();
			}
			fs.writeFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt', fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').replace(`\n${queueA[0]}`, ''));
			if (fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0] != null) {
				queue(fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0], voiceChannel, message);
			}
		});

		dispatcher.on('start', () =>{
			message.channel.send('help me jiltq isnt being very professional with writing this code--');
		});
	});
}
*/
/* async function play(message, args, time) {
	if (!args.length) return message.reply('**you have to give me something to play!**').then(messageE => setTimeout(function() {messageE.delete();}, 10000));

	const args2 = args.join(' ');
	const searchResults = JSON.parse(JSON.stringify(await (await ytsr(args2, { safeSearch: false, limit: 10 })).JSON()))['items'].filter(item => item['type'] == 'video');
	console.log(await ytsr(args2, { limit: 1 }))
	if (!searchResults[0].length) {
		play(message, args, time);
	}

	if (message.channel.type === 'dm') return;
	const voiceChannel = message.member.voice.channel;

	if (!voiceChannel) {
		return message.reply('please join a voice channel first!');
	}
	voiceChannel.join().then(async connection => {
		// const queueA = fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '');
		const video = await ytdl(searchResults[0]['link'], { begin: time });
		const dispatcher = connection.play(video);
		dispatcherModule.update(dispatcher);

		dispatcher.on('finish', () =>{
			if (dispatcherModule.getLooped() == false) {
				messageA.delete();
				messageA = null;
			}
			console.log(dispatcherModule.getLooped());
			if (dispatcherModule.getLooped() == true) {
				play(message, args, 0);
			}
		});
		/*
			dispatcher.on('finish', () =>{
				if (fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0] == null) {
				voiceChannel.leave();
				// }
				fs.writeFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt', fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').replace(`\n${queueA[0]}`, ''));
				if (fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0] != null) {
					queue(fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8').split('\n').filter(item => item != '')[0], voiceChannel, message);
				}
			});
*/
/* video.on('error', error =>{
			console.log(error);
		});
		dispatcher.on('error', () =>{
			const exampleEmbed = new Discord.MessageEmbed()
				.setTitle('something went wrong :(');
			message.channel.send(exampleEmbed);
			message.channel.send(dispatcher.streamTime);
			play(message, args, dispatcher.streamTime);
		});
		connection.on('error', () =>{
			message.channel.send('**something went wrong with this voice connection :(**');
			connection.disconnect()
				.then(() =>{
					voiceChannel.join();
				}, reason =>{
					console.log(reason);
				});
		});
		connection.on('failed', () =>{
			message.channel.send('**something went wrong with initiating this voice connection :(**');
		});
		dispatcher.on('start', () =>{
			if (dispatcherModule.getLooped() == false) {
				const exampleEmbed = new Discord.MessageEmbed()
					.setTitle(searchResults[0]['title'] || 'VIDEO TITLE')
					.setAuthor('now playing..')
					.setDescription(`**by ${searchResults[0]['author']['name'] || 'VIDEO AUTHOR NAME'}**`)
					.setImage(searchResults[0]['thumbnail'] || 'https://via.placeholder.com/150');
				message.channel.send(exampleEmbed).then(messageE => messageA = messageE);
			}
			console.log(`now playing ${searchResults[0]['link']}`);
		});
	});
}
/* function confirmVideo(index) {
		let verified = filtered[index]['author']['verified'];
		if (verified == true) {
			verified = ':ballot_box_with_check:';
		}
		else if (verified != true) {
			verified = '';
		}
		const exampleEmbed = new Discord.MessageEmbed()
			.setAuthor('found video.. is this what you were looking for?')
			.setTitle(filtered[index]['title'] || 'VIDEO TITLE')
			.setDescription(`**by ${filtered[index]['author']['name'] || 'VIDEO AUTHOR NAME'}**`)
			.setImage(filtered[index]['thumbnail'] || 'https://via.placeholder.com/150');
		message.channel.send(exampleEmbed).then(messageE => messageA = messageE);

		const filter = m => m.content.includes('yes') && m.author == message.author || m.content.includes('no') && m.author == message.author;
		const collector = message.channel.createMessageCollector(filter, { time: 15000 });

		collector.on('collect', m => {
			console.log(`Collected ${m.content}`);
			if (m.content == 'yes') {
				playVideo(filtered[index]['link'], index, 0);
				// fs.writeFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt', fs.readFileSync('C:/Users/Ethan/Discord Bots/Epic Gamer Bot/musicQueue.txt').toString('utf8') + ('\n' + filtered[index]['link']));
				collector.stop();
				messageA.delete();
				messageA = null;
				m.delete({ reason: 'to save space, your response was deleted' });
			}
			else if (m.content == 'no' && filtered[index + 1] != null) {
				confirmVideo(index + 1);
				collector.stop();
				messageA.delete();
				messageA = null;
				m.delete({ reason: 'to save space, your response was deleted' });
			}
			else if (m.content == 'no' && filtered[index + 1] == null) {
				confirmVideo(0);
				messageA.delete();
				messageA = null;
				m.delete({ reason: 'to save space, your response was deleted' });
			}
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
			if (!collected.array().length) {
				message.channel.send('**no response given, cancelling..**');
			}
		});
	} */

module.exports = {
	name: 'playold',
	description: 'Play a YouTube video',
	usage: '[video name]',
	async execute(message, args, IPM) {
		message.channel.send('this command is deprecated, use ?play instead!\n \nsorry for the inconvenience,\n-- jiltq');
		if (dispatcherModule.getDownloading() == true) return message.channel.send('a video is already downloading!');
		search(false, 1, false);
		async function search(looped, volume, retry) {
			let length = await IPM.return_json_length('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/music_queue.json');
			// if (length > 1 && !retry) return message.channel.send('music is already playing');

			const voiceChannel = message.member.voice.channel;
			/* Check for valid search query */
			if (!args.length) {
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('no video query given!')
					.setFooter('please provide a valid video query');
				return message.channel.send(embed);
			}
			/* Check for voice channel connection */
			if (!voiceChannel) {
				IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/data.json', 'playing', false);
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('you are not connected to a voice channel!')
					.setFooter('please connect to a voice channel to continue');
				return message.channel.send(embed);
			}
			/* Search for video under 3 hours */
			const r = await yts(args.join(' '));
			const videos = r.videos.slice(0, 10);
			let v = r.videos[0];
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

			if (parseInt(v.duration.toString().split('seconds')[0]) > 10800) {
				dispatcherModule.setDownloading(false);
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('video is over 3 hours!')
					.setFooter('please provide a shorter video');
				return message.channel.send(embed);
			}
			voiceChannel.join().then(async connection => {
				connection.on('error', async error=>{
					const embed = new Discord.MessageEmbed()
						.setColor('#7F0000')
						.setAuthor('an unexpected error was caused by the voice connection')
						.setTitle(`**${error.name || 'No error name has been provided'}**`)
						.setDescription(`**${error.message || 'No error message has been provided'}**`)
						.setTimestamp();
					message.channel.send(embed);
				});
				connection.on('failed', async error=>{
					const embed = new Discord.MessageEmbed()
						.setColor('#7F0000')
						.setAuthor('the voice connection failed to initiate')
						.setTitle(`**${error.name || 'No error name has been provided'}**`)
						.setDescription(`**${error.message || 'No error message has been provided'}**`)
						.setTimestamp();
					message.channel.send(embed);
				});
				if (looped == false) {
					const test = await ytdl(v.url);
					dispatcherModule.setDownloading(true);
					test.on('error', error =>{
						if (warning == false) {
							const embed = new Discord.MessageEmbed()
								.setColor('#7F0000')
								.setAuthor('an unexpected error occured while downloading your video')
								.setTitle(`**${error.name || 'No error name has been provided'}**`)
								.setDescription(`**${error.message || 'No error message has been provided'}**`)
								.setTimestamp();
							message.channel.send(embed);
							warning = true;
						}
						search(looped, volume, true);
						console.log(error);
					});
					const start = new Date().getTime();
					if (parseInt(v.duration.toString().split('seconds')[0]) > 10800) {
						dispatcherModule.setDownloading(false);
						const embed = new Discord.MessageEmbed()
							.setColor('#7F0000')
							.setAuthor('video is over 3 hours!')
							.setFooter('please provide a shorter video');
						return message.channel.send(embed);
					}
					console.log(parseInt(v.duration.toString().split('seconds')[0]));
					let notify = true;
					test.on('progress', (chunklength, totaldownloaded, total) =>{
						const now = new Date().getTime();
						const timeleft_ms = (total - totaldownloaded) / (totaldownloaded / (now - start));
						const timeleft_s = timeleft_ms / 1000;
						const timeleft_m = timeleft_s / 60;
						const timeleft_h = timeleft_m / 60;

						if (timeleft_h >= 1) {
							if (notify == true) {
								const embed = new Discord.MessageEmbed()
									.setAuthor('downloading..')
									.setTitle(`**${v.title}**`)
									.setDescription(`**by ${v.author.name}**`)
									.setFooter(`hours estimated remaining: ${timeleft_h}`);
								message.channel.send(embed);
								notify = false;
							}
						}

						// console.log(`Around ${timeleft_m} minutes and ${timeleft_s} seconds remaining..`);
						const string = '█';
						console.log(`${Math.floor(timeleft_m)}:${(timeleft_m - (Math.floor(timeleft_m))) * 60}`);
						// console.log(`[${string.repeat(10 * (totaldownloaded / total))}${' '.repeat(10 - (string.repeat(10 * (totaldownloaded / total)).length))}] ${Math.round(timeleft_m)}:${Math.round(timeleft_s)}`);
					});
					const a = test.pipe(fs.createWriteStream('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp3'));

					a.on('finish', async () =>{
						dispatcherModule.setDownloading(false);
						dispatcherModule.setplaying(true);
						IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/data.json', 'playing', true);
						IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/music_queue.json', `link${length}`, v.url);
						const dispatcher = connection.play('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp3');
						// const dispatcher = connection.play(fs.createReadStream('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.ogg'), { type: 'ogg/opus' });
						const embed = new Discord.MessageEmbed()
							.setAuthor('now playing..')
							.setTitle(`**${v.title || 'VIDEO TITLE'}**`)
							.setDescription(`**by ${v.author.name || 'VIDEO AUTHOR'}**`)
							.setImage(v.thumbnail || 'C:/Users/Ethan/Desktop/Placeholder_Thumbnail.png')
							.setFooter(`in channel: ${voiceChannel.name || 'VOICE CHANNEL NAME'}, requested by: ${message.member.user.username || 'USERNAME'}`);
						message.channel.send(embed);
						dispatcher.setVolume(volume);
						dispatcherModule.update(dispatcher);
						dispatcher.on('finish', () =>{
							if (dispatcherModule.getLooped() == true) {
								search(true, dispatcherModule.getVolume(), true);
							}
							else {
								fs.writeFileSync('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp3', '');
								IPM.delete_json_entry('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/music_queue.json', `link${length}`);
								IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/data.json', 'playing', false);
								dispatcherModule.setplaying(false);
							}
						});
						dispatcher.on('error', () =>{
							const error_embed = new Discord.MessageEmbed()
								.setColor('#7F0000')
								.setAuthor('an unexpected error occured while playing your video')
								.setTitle('**no further information has been provided**')
								.setTimestamp();
							message.channel.send(error_embed);
						});
					});
				}
				else {
					const dispatcher = connection.play('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp3');
					dispatcher.setVolume(volume);
					dispatcherModule.update(dispatcher);
					dispatcher.on('finish', () =>{
						if (dispatcherModule.getLooped() == true) {
							search(true, dispatcherModule.getVolume(), true);
						}
					});
				}
			});
		}
	},
	getplaying() {
		return playing_music;
	},
	reset_music_data() {
		fs.writeFileSync('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/data.json', JSON.stringify({ playing: false }));
		fs.writeFileSync('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp3', '');
	},
};
