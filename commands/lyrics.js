const util = require('util');
const fsp = require('fs').promises;
const Discord = require('discord.js');
const visuals = require('../visuals.js');
const execFile = util.promisify(require('child_process').execFile);
const getColors = require('get-image-colors');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const thumbnailFile = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/songThumbnail.png';
module.exports = {
	name: 'lyrics',
	description: 'get lyrics of a song',
	category: 'fun',
	async execute(message, args, IPM) {
		let processImage = true;
		const params = new URLSearchParams({
			title: args[0],
			cancer: args[1] || false,
		});
		const lyrics = await IPM.fetch(`https://some-random-api.ml/lyrics?${params.toString()}`);
		if (lyrics.error) {
			return message.channel.send({ embeds: [visuals.embeds.error(module, { name:'Error', message:lyrics.error })] });
		}
		await fsp.writeFile(thumbnailFile, '');
		await fsp.unlink(thumbnailFile);
		const downloadArgs = `-i  ${lyrics.thumbnail.genius}  ${thumbnailFile}`;
		await execFile('ffmpeg', downloadArgs.split('  '))
			.catch(async () =>{
				processImage = false;
			});
		let colors, color = '';
		if (processImage) {
			colors = await getColors(thumbnailFile);
			color = colors.map(clr => clr.hex())[0];
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor(lyrics.author)
			.setTitle(`${lyrics.title} - Lyrics`)
			.setURL(lyrics.links.genius)
			.setColor(color)
			.setThumbnail(lyrics.thumbnail.genius)
			.setDescription(trim(lyrics.lyrics, 2048));
		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};
