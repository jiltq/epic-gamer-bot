const ytsr = require('ytsr');
const Discord = require('discord.js');

async function search(message, args) {
	const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
	const args2 = args.join(' ');
	const searchResults = await ytsr(args2, { safeSearch: false, limit: 1000 });
	const e = JSON.stringify(searchResults);
	const a = JSON.parse(e);
	const filtered = a['items'].filter(item => item['type'] == 'video');
	if (!filtered.length) return message.chanel.send('oh no theres no videos aa')
	filtered.forEach(myfunction)
	console.log(filtered[0]['link']);
	function myfunction (item, index) {

	message.channel.send(item['link']);
}
}

module.exports = {
	name: 'search',
	description: 'test',
	execute(message, args) {
		return;
		search(message, args);
	},
};
