const fetch = require('node-fetch');
const { spotifyId, spotifySecret } = require('./config.json');
const querystring = require('querystring');
const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const fs = require('fs');

class Voice {
	constructor() {
	}
	joinVC(interaction) {
		return voice.joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			selfDeaf: true,
			selfMute: false,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
	}
	/**
	 * Download a YouTube video
	 * @param {string} url The YouTube URL
	 * @returns {ReadableStream} The audio stream
	 */
	download(url) {
		return ytdl(url, { filter: 'audioonly' });
	}
	play(connection, stream) {
		this.resource = voice.createAudioResource(stream, { inputType: voice.StreamType.Arbitrary, inlineVolume: true });
		const player = voice.createAudioPlayer();
		connection.subscribe(player);
		player.play(this.resource);
		return player;
	}
	createControlPanel() {
		const row1 = new Discord.MessageActionRow()
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
				/*
				new Discord.MessageButton()
					.setEmoji('<:egb_loop:899358138849955920>')
					.setCustomId('loop')
					.setStyle('PRIMARY'),
					*/
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
		return [row1, row2];
	}
	idkControlPanel(interaction, controlPanel, { response, player, resource }) {
		let volume = 1.0;
		const row = controlPanel[0];
		const row2 = controlPanel[1];
		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.message.id == response.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 200 * 1000 });
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

				break;
			case 'volumeup':
				this.resource.volume.setVolume(volume + 0.5);
				volume = volume + 0.5;
				row2.components[1].setDisabled(volume == 0.0);
				break;
			case 'volumedown':
				this.resource.volume.setVolume(volume - 0.5);
				volume = volume - 0.5;
				row2.components[1].setDisabled(volume == 0.0);
				break;
			case 'loop':

				break;
			}
			return i.update({ components: [row, row2] });
		});
	}
}
module.exports = Voice;