const Scraper = require('images-scraper');

module.exports = {
	name: 'gif',
	description: 'search for a gif!',
	category: 'fun',
	usage: '[gif to search for]',
	args: true,
	async execute(message, args, IPM, client) {
		return;
		IPM.executeCommand('gimage', message, [ `${args.join(' ')} gif` ], client);
	},
	async internal(args, index) {
		const google = new Scraper({
			puppeteer: {
				headless: true,
			},
			tbs: { safe: 'on' },
		});
		const result = await google.scrape(`${args.join(' ')} gif`, (index + 1));
		if (!result.length) return;
		return result[index]['url'];
	},
};
