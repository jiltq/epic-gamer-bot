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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a youtube video')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of video to play')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('loop')
				.setDescription('whether or not to loop the song')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			selfDeaf: true,
			selfMute: false,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		let volume = 1.0;
		let muted = false;
		const video = (await yts(interaction.options.getString('name'))).videos[0];
		const stream = ytdl(video.url, { filter: 'audioonly' });
		const metadata = await ytdl.getInfo(video.url);
		const seconds = parseFloat(metadata.player_response.videoDetails.lengthSeconds);
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
		const player = createAudioPlayer();

		player.play(resource);
		connection.subscribe(player);

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
		const file = new Discord.MessageAttachment('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/music_icon.png');
		const embed = new Discord.MessageEmbed()
			.setAuthor('music player', 'attachment://music_icon.png')
			.setURL(video.url)
			.setTitle(`**${video.title}**`)
			.setDescription(`**by ${video.author.name}**`)
			.setImage(video.thumbnail);
		const response = await interaction.editReply({ embeds: [embed], components: [row, row2], files: [file], allowedMentions: { repliedUser: false } });
		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.message.id == response.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: seconds * 1000 });

		collector.on('collect', async i => {
			switch (i.customId) {
			case 'resume':
				player.unpause();
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(false);
				break;
			case 'pause':
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
			return i.update({ embeds: [embed], components: [row, row2] });
		});
		collector.on('end', async () =>{
			for (const component of row.components) {
				component.setDisabled(true);
			}
			for (const component of row2.components) {
				component.setDisabled(true);
			}
			return response.edit({ embeds: [embed], components: [row, row2] });
		});
		player.on(AudioPlayerStatus.Idle, () => connection.destroy());
	},
};