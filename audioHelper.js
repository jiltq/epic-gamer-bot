const Opus = require('ytdl-core-discord');
const prism = require('prism-media');
const fs = require('fs');

/*
  Possible audio types:

  * opus
*/
module.exports = {
	AudioHelper: class AudioHelper {
		constructor(type) {
			this.type = type;
		}
		async create(url) {
			let audio;
			if (this.type == 'opus') {
				audio = await Opus(url);
			}
			if (this.type == 'pcm') {
				audio = await Opus(url);
				const decoder = new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 });
				audio.pipe(decoder);
			}
			return audio;
		}
	},
};
