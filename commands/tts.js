const gTTS = require('gtts');
const Voice = require('@discordjs/voice');

let lastTalked;

module.exports = {
	name: 'tts',
	description: 'Say things in a VC',
	category: 'utility',
	usage: '[text to say]',
	args: true,
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
		connection.subscribe(player);
		const gtts = lastTalked == message.author.id ? new gTTS(args.join(','), 'en') : new gTTS(`${message.member.displayName.split(' ')[0]} says ${args.join(',')}`, 'en')
		gtts.save('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/ttsaudio.mp3', async function(err, result) {
			if (!err) {
				const resource = Voice.createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/ttsaudio.mp3');
				player.play(resource);
				message.react('🗣️');
				lastTalked = message.author.id;
			}
		});
	},
};
