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
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
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
					.setEmoji('🎧')
					.setLabel('join')
					.setURL((await interaction.member.voice.channel.createInvite({ temporary: true, maxAge: seconds })).url)
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
				new Discord.MessageButton()
					.setEmoji('🔁')
					.setCustomId('loop')
					.setStyle('SECONDARY'),
			);
		const volumeRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('volume')
					.addOptions([
						{
							label: 'mute',
							value: '0.0',
							emoji: '🔇',
						},
						{
							label: 'half volume',
							value: '0.5',
							emoji: '🔈',
						},
						{
							label: 'normal volume',
							value: '1.0',
							emoji: '🔉',
							default: true,
						},
						{
							label: '2x volume',
							value: '2.0',
							emoji: '🔊',
						},
						{
							label: '10x volume',
							description: 'why',
							value: '10.0',
							emoji: '📢',
						},
					]),
			);
		const embed = new Discord.MessageEmbed()
			.setAuthor('now playing..')
			.setTitle(`**${video.title}**`)
			.setDescription(`**by ${video.author.name}**`)
			.setImage(video.thumbnail);
		const response = await interaction.editReply({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
		const filter = i => i.user.id == interaction.user.id && i.message.id == response.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: seconds * 1000 });

		collector.on('collect', async i => {
			switch (i.customId) {
			case 'resume':
				player.unpause();
				row.components[1].setDisabled(true);
				row.components[2].setDisabled(false);
				return i.update({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
			case 'pause':
				player.pause();
				row.components[1].setDisabled(false);
				row.components[2].setDisabled(true);
				return i.update({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
			case 'stop':
				player.stop();
				for (const component of row.components) {
					component.setDisabled(true);
				}
				volumeRow.components[0].setDisabled(true);
				return i.update({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
			case 'volume':
				resource.volume.setVolume(parseFloat(i.values[0]));
				return i.update({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
			case 'loop':

				return;
			}
		});
		collector.on('end', async () =>{
			for (const component of row.components) {
				component.setDisabled(true);
			}
			volumeRow.components[0].setDisabled(true);
			return response.edit({ embeds: [embed], components: [row, volumeRow], allowedMentions: { repliedUser: false } });
		});
		player.on(AudioPlayerStatus.Idle, () => connection.destroy());
	},
};