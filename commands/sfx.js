const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

const links = {
	boi: 'https://www.youtube.com/watch?v=rLhzbjaaOPA',
	doot: 'https://www.youtube.com/watch?v=eVrYbKBrI7o',
	laugh: 'https://www.youtube.com/watch?v=iYVO5bUFww0',
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sfx')
		.setDescription('plays a sound effect')
		.addStringOption(option =>{
			option.setName('sound')
				.setDescription('sound effect to play')
				.setRequired(true);
			for (const [key, value] of Object.entries(links)) {
				option.addChoice(key, value);
			}
			return option;
		}),
	async execute(interaction) {
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const stream = ytdl(interaction.options.getString('sound'), { filter: 'audioonly' });
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
		const player = createAudioPlayer();
		player.play(resource);
		connection.subscribe(player);
		player.on(AudioPlayerStatus.Idle, async () =>{
			connection.destroy();
			await interaction.deleteReply();
		});
	},
};
