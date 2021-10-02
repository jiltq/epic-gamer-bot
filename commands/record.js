const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');
const Voice = require('@discordjs/voice');
const { opus } = require('prism-media');
const stream = require('stream');

module.exports = {
	name: 'record',
	description: 'Record your voice',
	category: 'utility',
	async execute(message, args, IPM) {
		const channel = message.member.voice.channel;
		const connection = Voice.joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			selfDeaf: false,
			selfMute: true,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		await Voice.entersState(connection, Voice.VoiceConnectionStatus.Ready, 20e3);
		const receiver = connection.receiver;
		receiver.speaking.on('start', (userId) => {
			const opusStream = receiver.subscribe(userId, {
				end: {
					behavior: Voice.EndBehaviorType.AfterSilence,
					duration: 100,
				},
			});
			const oggStream = new opus.OggLogicalBitstream({
				opusHead: new opus.OpusHead({
					channelCount: 2,
					sampleRate: 48000,
				}),
				pageSizeControl: {
					maxPackets: 10,
				},
			});
			const out = fs.createWriteStream('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/w.ogg');
			stream.pipeline(opusStream, oggStream, out, (err) => {
				if (err) {
					console.warn(`❌ Error recording file`);
				} else {
					console.log(`✅ Recorded`);
				}
			});
		});
	},
};
