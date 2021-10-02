const yts = require('yt-search');
const pageHelper = require('../pageHelper');

module.exports = {
	name: 'ytvid',
	description: 'search for a YouTube video',
	category: 'fun',
	usage: '[video to search for]',
	args: true,
	async execute(message, args, IPM) {
		const r = await yts(args.join(' '));
		const url = r.videos[0].url;
		message.channel.send({ content: url }).then(async newMessage =>{
			const list = [
				url,
				r.videos[1].url,
			];
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage, false);
			const events = await PageHelper.events();
			await PageHelper.start(list);
			events.on('next', async () =>{
				const list2 = await PageHelper.returnList();
				await PageHelper.addItem(r.videos[list2.length].url);
			});
		});
	},
};
