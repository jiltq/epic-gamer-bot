const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const fs = require('fs');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');

const video = 'https://www.youtube.com/watch?v=X8avbciUP3c';

const _getAllFilesFromFolder = function(dir) {
	let results = [];
	fs.readdirSync(dir).forEach(function(file) {
		file = dir + '/' + file;
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(_getAllFilesFromFolder(file));
		}
		else {
			results.push(file);
		}
	});
	return results;
};

module.exports = {
	name: 'crap',
	description: 'test',
	async execute(message, args) {
		if (message.author.id != '695662672687005737') return;
		for (const frame of _getAllFilesFromFolder('C:/Users/Ethan/OneDrive/Desktop/crap/frames/')) {
			fs.unlinkSync(frame);
		}
		fs.unlinkSync('C:/Users/Ethan/OneDrive/Desktop/crap/video.mp4');
		const response = await message.channel.send({ content: 'ok gimme a sec' });
		const stream = ytdl(video);
		const thing = stream.pipe(fs.createWriteStream('C:/Users/Ethan/OneDrive/Desktop/crap/video.mp4'));

		thing.on('finish', async () =>{
			const frameArgs = '-i|C:/Users/Ethan/OneDrive/Desktop/crap/video.mp4|C:/Users/Ethan/OneDrive/Desktop/crap/frames/%d.png'.split('|');
			await execFile('ffmpeg', frameArgs).then(async () =>{
				const frames = _getAllFilesFromFolder('C:/Users/Ethan/OneDrive/Desktop/crap/frames/');
				let index = -1;
				setInterval(async () =>{
					if (index++ < frames.length) {
						index++;
						const file = new Discord.MessageAttachment(frames[index]);
						await message.channel.send({ content: `frame: ${index}`, files: [file] });
					}
				}, 1000 / 15);
			});
		});
	},
};
