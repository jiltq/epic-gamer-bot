const Discord = require('discord.js');
const yts = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Voice = new (require('../voiceHelper.js'))();
const { AudioPlayerStatus } = require('@discordjs/voice');

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
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('private')
				.setDescription('if egb should make the music interface publicly visible')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const musicIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/music_icon.png`);
		const connection = Voice.joinVC(interaction);
		const video = (await yts(interaction.options.getString('name'))).videos[0];
		const download = Voice.download(video.url);
		const player = Voice.play(connection, download);
		const controlPanel = Voice.createControlPanel();

		const songEmbed = new Discord.MessageEmbed()
			.setAuthor('music player', 'attachment://music_icon.png')
			.setColor('#5865F2')
			.setURL(video.url)
			.setTitle(video.title)
			.setDescription(`**${video.author.name}**`)
			.setImage(video.thumbnail);

		const response = await interaction.editReply({ embeds: [songEmbed], components: controlPanel, files: [musicIcon], ephemeral: false });
		Voice.idkControlPanel(interaction, controlPanel, { response: response, player: player, resource: download });
		player.on(AudioPlayerStatus.Idle, async () => await response.delete());
	},
};