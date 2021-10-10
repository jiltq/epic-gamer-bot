const Voice = require('@discordjs/voice');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
	name: 'play',
	description: 'play a YouTube video',
	usage: '[video name, volume]',
	category: 'music',
	args: false,
	async execute(message, args) {
		const channel = message.member.voice.channel;
		if (!channel) {
			return message.react('❌');
		}
		const connection = Voice.joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			selfDeaf: true,
			selfMute: false,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		await Voice.entersState(connection, Voice.VoiceConnectionStatus.Ready, 20e3);
		const player = Voice.createAudioPlayer({
			behaviors: {
				noSubscriber: Voice.NoSubscriberBehavior.Pause,
			},
		});
		const video = (await yts(args.join(' '))).videos[0];
		const stream = ytdl(video.url, { filter: 'audioonly' });
		stream.once('progress', (chunklength, totaldownloaded, total) =>{
			const mb = total / 1e+6;
			const timeSeconds = mb / 3;
			const downloadEmbed = new Discord.MessageEmbed()
				.setTitle('downloading your video..')
				.setDescription(`at 3mb/s, this will take around \`${timeSeconds.toFixed(1)}\` second(s)`);
			message.channel.send({ embeds: [downloadEmbed] });
		});
		const metadata = await ytdl.getInfo(video.url);
		const seconds = parseFloat(metadata.player_response.videoDetails.lengthSeconds);
		const thing = stream.pipe(fs.createWriteStream('ytAudio.ogg'));

		thing.on('finish', async () =>{
			connection.subscribe(player);
			const resource = Voice.createAudioResource('ytAudio.ogg', { inputType: Voice.StreamType.OggOpus });
			player.play(resource);
			const row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setEmoji('🎧')
						.setURL((await message.member.voice.channel.createInvite({ temporary: true, maxAge: seconds })).url)
						.setStyle('LINK'),
					new Discord.MessageButton()
						.setEmoji('▶️')
						.setCustomId('resume')
						.setDisabled(true)
						.setStyle('PRIMARY'),
					new Discord.MessageButton()
						.setEmoji('⏸️')
						.setCustomId('pause')
						.setStyle('SECONDARY'),
					new Discord.MessageButton()
						.setEmoji('⏹️')
						.setCustomId('stop')
						.setStyle('DANGER'),
				);
			const embed = new Discord.MessageEmbed()
				.setAuthor('now playing..')
				.setTitle(`**${video.title}**`)
				.setDescription(`**by ${video.author.name}**`)
				.setImage(video.thumbnail);
			const response = await message.reply({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });
			const filter = i => i.user.id == message.author.id && i.message.id == response.id;

			const collector = message.channel.createMessageComponentCollector({ filter, time: seconds * 1000 });

			collector.on('collect', async i => {
				switch (i.customId) {
				case 'resume':
					player.unpause();
					row.components[1].setDisabled(true);
					row.components[2].setDisabled(false);
					return i.update({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });
				case 'pause':
					player.pause();
					row.components[1].setDisabled(false);
					row.components[2].setDisabled(true);
					return i.update({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });
				case 'stop':
					player.stop();
					row.components[0].setDisabled(true);
					row.components[1].setDisabled(true);
					row.components[2].setDisabled(true);
					row.components[3].setDisabled(true);
					return i.update({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });
				}
				switch (i.value) {
				case '0.5':
					return resource.volume.setVolume(0.5);
				case '1.0':
					return resource.volume.setVolume(1.0);
				case '2.0':
					return resource.volume.setVolume(2.0);
				}
			});
			collector.on('end', async () =>{
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(true);
				row.components[2].setDisabled(true);
				row.components[3].setDisabled(true);
				return response.edit({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });
			});
			connection.on(Voice.VoiceConnectionStatus.Disconnected, async () => {
				try {
					await Promise.race([
						Voice.entersState(connection, Voice.VoiceConnectionStatus.Signalling, 5000),
						Voice.entersState(connection, Voice.VoiceConnectionStatus.Connecting, 5000),
					]);
				}
				catch (error) {
					connection.destroy();
				}
			});
		});
	},
};