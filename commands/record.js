const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	EndBehaviorType,
} = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('fs');
const { pipeline } = require('stream');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('record')
		.setDescription('record your voice'),
	async execute(interaction) {
		return;
		await interaction.deferReply();
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			selfDeaf: false,
			selfMute: true,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const receiver = connection.receiver;
		const stream = receiver.subscribe(interaction.user.id, {
			end: {
				behavior: EndBehaviorType.AfterSilence,
				duration: 100,
			},
		});
		const out = fs.createWriteStream('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/audio.ogg');
		stream.pipe(out);
	},
};
