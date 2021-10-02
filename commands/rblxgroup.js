const Discord = require('discord.js');
const querystring = require('querystring');
const embedHelper = require('../embedHelper');

const errorEmbed = new embedHelper.ErrorEmbed(Discord);
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = {
	name: 'rblxgroup',
	description: 'Search for a roblox group',
	category: 'fun',
	args: false,
	usage: '[keyword or nothing for a random group, prioritizeExactMatch]',
	async execute(message, args, IPM) {
		const random = args.length == 0;
		const prioritizeExactMatch = random ? false : args[1] || false;
		let query;
		if (random) {
			const randomlimit = Math.floor(Math.random() * 50) + 2;
			query = querystring.stringify({ keyword: makeid(randomlimit) });
		}
		else {
			query = querystring.stringify({ keyword: args[0] });
		}
		const { data } = await IPM.fetch(`https://groups.roblox.com/v1/groups/search?${query}&prioritizeExactMatch=${prioritizeExactMatch}`);
		if (data == null) {
			if (!random) {
				const embed = await errorEmbed.create('no results found!', 'check your spelling or try different keywords');
				return message.channel.send(embed);
			}
			else {
				return await module.exports.execute(message, args, IPM);
			}
		}
		if (data.length < 1) {
			if (!random) {
				const embed = await errorEmbed.create('no results found!', 'check your spelling or try different keywords');
				return message.channel.send(embed);
			}
			else {
				return await module.exports.execute(message, args, IPM);
			}
		}
		const group = data[0];
		const public = group.publicEntryAllowed ? 'Yes' : 'No';
		let icon = await IPM.fetch(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${group.id}&size=150x150&format=Png`);
		icon = icon.data[0].imageUrl;
		const sociallinks = await IPM.fetch(`https://groups.roblox.com/v1/groups/${group.id}/social-links`);
		if (!sociallinks.data) {
			sociallinks.data = [];
		}
		const embed = new Discord.MessageEmbed()
			.setTitle(group.name)
			.setURL(`https://www.roblox.com/groups/${group.id}`)
			.setDescription(trim(group.description, 2048))
			.setThumbnail(icon)
			.addField('Member Count', group.memberCount, true)
			.addField('Public Entry Allowed', public, true)
			.setTimestamp(new Date(group.created))
			.setFooter('🍰 B-day');
		for (let i = 0; i < sociallinks.data; i++) {
			const sociallink = sociallinks.data[i];
			embed.addField(sociallink.type, sociallink.url, true);
		}
		return message.channel.send(embed);
	},
};
