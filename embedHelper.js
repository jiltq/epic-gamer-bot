const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

/*
	Replacing this with new visuals module! Please don't use this, jiltq!

	-- jiltq
*/

class Embed {
	constructor(Discord) {
		this.Discord = Discord;
	}
	async create(options) {
		const embed = new this.Discord.MessageEmbed(options);
		return embed;
	}
}
module.exports = {
	WarningEmbed: class WarningEmbed extends Embed {
		constructor(discord) {
			super(discord);
		}
		async create(warning, warningDesc) {
			const warningOptions = {
				color: 'FFD700',
				title: warning,
				description: warningDesc,
			};
			return await super.create(warningOptions);
		}
	},
	ErrorEmbed: class ErrorEmbed extends Embed {
		constructor(discord) {
			super(discord);
		}
		async create(error, errorDesc) {
			const errorOptions = {
				color: '#7F0000',
				title: error,
				description: errorDesc,
			};
			return await super.create(errorOptions);
		}
	},
	SuccessEmbed: class SuccessEmbed extends Embed {
		constructor(discord) {
			super(discord);
		}
		async create(successMessage, successDesc = '') {
			const errorOptions = {
				color: '#007F00',
				title: successMessage,
				description: successDesc,
			};
			return await super.create(errorOptions);
		}
	},
	playOpusEmbeds: {
		VideoEmbed: class VideoEmbed extends Embed {
			constructor(discord) {
				super(discord);
			}
			async create(video, voiceChannel, message) {
				const videoOptions = {
					title: trim(video.title, 256),
					description: trim(`**by ${video.author.name}**`, 2048),
					author: {
						name: 'now playing..',
						icon_url: '',
						url: '',
					},
					image: {
						url: video.thumbnail || '',
					},
					footer: {
						text: `in channel: ${voiceChannel.name || 'VOICE CHANNEL NAME'}, requested by: ${message.member.user.username || 'USERNAME'}`,
						icon_url: '',
					},
				};
				return await super.create(videoOptions);
			}
		},
	},
};
