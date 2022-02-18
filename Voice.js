const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	demuxProbe,
} = require('@discordjs/voice');
const Discord = require('discord.js');
const youtubedl = require('youtube-dl-exec');
const { stream } = require('play-dl');

/**
 * Class for easily working with Voice Channels
 */
class Voice {
	/**
     * Join a Voice Channel
     * @param {Discord.VoiceChannel} voiceChannel Channel to join
     * @returns {voice.VoiceConnection} The resulting voice connection
     */
	static joinVC(voiceChannel) {
		return joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guildId,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});
	}
	/**
     * Play an audio stream
     * @param {*} connection
     * @param {*} stream
     * @returns
     */
	static play(connection, stream) {
		this.resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
		const player = createAudioPlayer();
		player.play(this.resource);
		connection.subscribe(player);
		return player;
	}
	static playResource(connection, resource) {
		this.resource = resource;
		const player = createAudioPlayer();
		player.play(this.resource);
		connection.subscribe(player);
		return player;
	}
	static createControlPanel() {
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
	static idkControlPanel(interaction, controlPanel, { response, player, resource }) {
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
	static async downloadVideo(url) {
		const _stream = await stream(url);
		return createAudioResource(_stream.stream, {
			inputType: _stream.type,
			inlineVolume: true,
		});
	}
}
module.exports = Voice;