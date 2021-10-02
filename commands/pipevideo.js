const ytdl = require('ytdl-core');
const fs = require('fs');
const Discord = require('discord.js')
const yts = require('yt-search')

let reminder = false

module.exports = {
	name: 'pipevideo',
	description: '',
	async execute(message, args) {
		yes();
		async function yes() {
			const start = new Date().getTime();
				const r = await yts(args.join(' '));
				const result = r.videos.slice(0, 1);

				const v = r.videos[0]
				message.channel.send(`attempting to pipe **${v.title}**`)
				const test = ytdl(v.url)
				test.on('progress', (chunklength, totaldownloaded, total) =>{
					const now = new Date().getTime();
					const timeleft_ms = (total - totaldownloaded) / (totaldownloaded / (now - start));
					const timeleft_s = timeleft_ms / 1000;
					const timeleft_m = timeleft_s / 60;
					const timeleft_h = timeleft_m / 60;

					console.log(`Around ${timeleft_m} minutes and ${timeleft_s} seconds remaining..`);
					if (timeleft_m >= 60) {
						if (reminder == false) {
							message.channel.send('this may take a while.. (estimated 1 hour wait time)')
							reminder = true
						}
					}
				});
				test.on('error', () =>{
					yes()
				})
				const a = test.pipe(fs.createWriteStream('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp4'));
				a.on('finish', () =>{
					message.channel.send('ok heres your video', { files: ["C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/video.mp4"] })
				});
				a.on('error', () =>{
					yes()
				})
		}
	},
};
