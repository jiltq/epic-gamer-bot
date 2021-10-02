const Discord = require('discord.js');
const querystring = require('querystring');
const embedHelper = require('../embedHelper');
const pageHelper = require('../pageHelper');

const missing = '???';
const errorEmbed = new embedHelper.ErrorEmbed(Discord);

async function cycleThruPages(url, IPM) {
	const first = await IPM.fetch(url);
	let cursor = first.nextPageCursor;
	do {
		if (cursor == null) break;
		const result = await IPM.fetch(`${url}&cursor=${cursor}`);
		first.data = [
			...first.data,
			...result.data,
		];
		cursor = result.nextPageCursor;
	}
	while (cursor != null && cursor != undefined);
	return first;
}
async function reportRblxErr(json) {
	const err = json.errors[0];
	const embed = await errorEmbed.create(`Error code ${err.code}`, err.message);
	return embed;
}
async function correctNull(value) {
	if (value == null || value == undefined || value == '') return missing;
	else return value;
}

module.exports = {
	name: 'rblxuser',
	description: 'Search up a user on roblox',
	category: 'fun',
	usage: '[user to search up, whether or not to use direct ID]',
	args: true,
	async execute(message, args, IPM) {
		let direct = false;
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		if (args[1]) {
			if (args[1].toLowerCase() == 'true') direct = true;
		}
		if (direct && isNaN(args[0])) {
			const embed = await errorEmbed.create('user ids may only consist of numbers!', 'if you want to search by usernames, please leave the second argument blank');
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		}
		const query = querystring.stringify({ keyword: args[0] });
		let id = await IPM.fetch(`https://users.roblox.com/v1/users/search?${query}&limit=10`);
		if (!direct) {
			if (id.data != null) {
				id = id.data[0].id;
			}
			else {
				const embed = await errorEmbed.create('no results found!', 'check your spelling or try different keywords');
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
		}
		else {
			id = args[0];
		}
		const user = await IPM.fetch(`https://users.roblox.com/v1/users/${id}`);
		if (user.id == null) {
			return message.reply({ embeds: [await reportRblxErr(user)], allowedMentions: { repliedUser: false } });
		}
		const bust = (await IPM.fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${id}&size=150x150&format=Png&isCircular=true`)).data[0].imageUrl;
		const friends = (await IPM.fetch(`https://friends.roblox.com/v1/users/${id}/friends/count`)).count;
		const followers = (await IPM.fetch(`https://friends.roblox.com/v1/users/${id}/followers/count`)).count;
		const following = (await IPM.fetch(`https://friends.roblox.com/v1/users/${id}/followings/count`)).count;
		const collectibles = await cycleThruPages(`https://inventory.roblox.com/v1/users/${id}/assets/collectibles?sortOrder=Desc&limit=100`, IPM);
		const badges = await cycleThruPages(`https://badges.roblox.com/v1/users/${id}/badges?limit=100&sortOrder=Desc`, IPM);
		const games = await cycleThruPages(`https://games.roblox.com/v2/users/${id}/games?sortOrder=Asc&limit=50`, IPM);
		const presBody = {
			'userIds': [
				id,
			],
		};
		let presence = await IPM.fetch('https://presence.roblox.com/v1/presence/users', {
			method: 'post',
			body: JSON.stringify(presBody),
			headers: { 'Content-Type': 'application/json' },
		});
		const rawPres = presence.userPresences[0];
		presence = presence.userPresences[0].userPresenceType;
		let rap = missing;
		if (collectibles.data) {
			if (collectibles.data.length == 0) {
				collectibles.data = [
					{
						'recentAveragePrice': 0,
					},
				];
			}
			const collectiblesPrices = collectibles.data.map(collectible => collectible.recentAveragePrice);
			rap = collectiblesPrices.reduce(function(a, b) {
				return a + b;
			}, 0);
		}
		const embed1 = new Discord.MessageEmbed()
			.setTitle(user.displayName)
			.setDescription(`@${user.name}`)
			.setThumbnail(bust)
			.addField('About', await correctNull(user.description), false)
			.addField('Friends', (await correctNull(friends)).toString(), true)
			.addField('Followers', (await correctNull(followers)).toString(), true)
			.addField('Following', (await correctNull(following)).toString(), true)
			.addField('RAP', (await correctNull(rap)).toString(), true)
			.addField('Badges', (await correctNull(badges.data.length)).toString(), true)
			.addField('Games', (await correctNull(games.data.length)).toString(), true)
			.setTimestamp(new Date(user.created))
			.setFooter('🍰 B-day');
		switch(presence) {
		case 0:
			embed1.setAuthor(`Offline - Last seen ${(new Date(rawPres.lastOnline)).toDateString()}`);
			break;
		case 1:
			embed1.setColor('#00a2ff');
			embed1.setAuthor('Online');
			break;
		case 2:
			embed1.setColor('#02b757');
			embed1.setAuthor(`Playing ${rawPres.lastLocation}`, '', `https://www.roblox.com/games/${rawPres.placeId}`);
			break;
		case 3:
			embed1.setColor('#f68802');
			embed1.setAuthor('In Studio', '');
			break;
		}
		if (user.isBanned) {
			embed1.setColor('#ed4245');
			embed1.setAuthor('Account Terminated');
		}
		const embed2 = new Discord.MessageEmbed()
			.setTitle(`${user.name}'s Collectibles`);
		if (collectibles.data) {
			for (let i = 0;i < collectibles.data.length && i < 12;i++) {
				const collectible = collectibles.data[i];
				embed2.addField(await correctNull(collectible.name), `Price: $${collectible.recentAveragePrice}`, true);
			}
		}
		const embed3 = new Discord.MessageEmbed()
			.setTitle(`${user.name}'s Badges`);
		for (let i = 0;i < badges.data.length && i < 12;i++) {
			const badge = badges.data[i];
			embed3.addField(await correctNull(badge.name), `Description: ${badge.description}`, true);
		}
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('Profile')
					.setURL(`https://www.roblox.com/users/${id}/profile`)
					.setStyle('LINK'),
			);
		message.reply({ embeds: [embed1], components: [row], allowedMentions: { repliedUser: false } }).then(async newMessage =>{
			const list = [
				embed1,
				embed2,
				embed3,
			];
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage, true, row);
			await PageHelper.start(list);
		});
	},
	async internal(message, args) {
		const IPM = args[2];
		return await module.exports.execute(message, [args[0], args[1]], IPM);
	},
};
