const Discord = require('discord.js');
const querystring = require('querystring');
const pageHelper = require('../pageHelper');

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{]}|;:,<.>/';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = {
	name: 'rblxgame',
	description: 'Search up a game on roblox',
	category: 'fun',
	usage: '[what to search for or nothing for a random game]',
	args: false,
	async execute(message, args, IPM) {
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		let query;
		if (args.length < 1) query = querystring.stringify({ keyword: makeid(Math.round(Math.random() * 100)) });
		else query = querystring.stringify({ keyword: args.join(' ') });
		const games = await IPM.fetch(`https://games.roblox.com/v1/games/list?model.${query}`);
		const game = games.games[0];
		console.log(game.universeId)
		if (!game && args.length > 0) {
			return message.channel.send('no results found!');
		}
		else if (!game && args.length < 1) {
			return await module.exports.execute(message, args, IPM);
		}
		const embed1 = new Discord.MessageEmbed()
			.setAuthor(game.creatorName)
			.setTitle(game.name)
			.setURL(`https://www.roblox.com/games/${game.placeId}`)
			.setDescription(trim(game.gameDescription, 2048))
			.addField('Rating', `:thumbup:\`${Math.round((game.totalUpVotes / (game.totalUpVotes + game.totalDownVotes)) * 100)}%\` :thumbdown:\`${Math.round((game.totalDownVotes / (game.totalUpVotes + game.totalDownVotes)) * 100)}%\``, false);
		const embed2 = new Discord.MessageEmbed()
			.setTitle('Badges');
		const embed3 = new Discord.MessageEmbed()
			.setTitle('Game Passes');
		message.channel.send(embed1).then(async newMessage =>{
			const list = [
				embed1,
				embed2,
				embed3,
			];
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage);
			await PageHelper.start(list);
		});
	},
};
