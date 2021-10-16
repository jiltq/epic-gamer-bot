const gTTS = require('gtts');
const Voice = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

let lastTalked;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('say things in a vc')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('text to say')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('language')
				.setDescription('language to speak')
				.setRequired(false)),
	async execute(interaction) {
		const channel = interaction.member.voice.channel;
		if (!channel) {
			return interaction.editReply({ content: 'oi you gotta join a vc', ephemeral: true });
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
		const gtts = lastTalked == interaction.user.id ? new gTTS(interaction.options.getString('text'), 'en') : new gTTS(`${interaction.member.displayName.split(' ')[0]} says ${interaction.options.getString('text')}`, 'en');
		gtts.save('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/ttsaudio.mp3', async function(err, result) {
			if (!err) {
				const resource = Voice.createAudioResource('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/ttsaudio.mp3');
				player.play(resource);
				lastTalked = interaction.user.id;
				await interaction.deleteReply();
			}
		});
	},
};
