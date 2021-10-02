const Discord = require('discord.js');
const embedHelper = require('../embedHelper');
const errorEmbed = new embedHelper.ErrorEmbed(Discord);

module.exports = {
	name: 'boi',
	description: 'Plays the "boi" sound effect',
	async execute(message) {
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			const embed = await errorEmbed.create('you are not connected to a voice channel!', 'please connect to a voice channel to continue');
			return message.channel.send(embed);
		}
		voiceChannel.join().then(async connection => {
			const dispatcher = connection.play('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/Sounds/boi.mp3');
			dispatcher.on('finish', () => {
				connection.disconnect();
			});
		});
	},
};
