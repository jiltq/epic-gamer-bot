const Voice = require('@discordjs/voice');
const Discord = require('discord.js');

module.exports = {
	name: 'play2',
	description: 'Play a YouTube video',
	usage: '[video name, volume]',
	category: 'music',
	args: false,
	async execute(message, args, IPM) {
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
		if (!args.length) {
			const suggestEmbed = new Discord.MessageEmbed()
				.setTitle('Music Suggestions');
			return message.reply({ embeds: [suggestEmbed], allowedMentions: { repliedUser: false } });
		}
	},
};