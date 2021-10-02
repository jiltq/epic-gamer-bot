const Discord = require('discord.js');
const embedHelper = require('../embedHelper');

const errorEmbed = new embedHelper.ErrorEmbed(Discord);

async function reportRblxErr(json) {
	const err = json.errors[0];
	const embed = await errorEmbed.create(`Error code ${err.code}`, err.message);
	return embed;
}

module.exports = {
	name: 'rblxbadge',
	description: 'Get information about a roblox badge',
	category: 'fun',
	args: true,
	async execute(message, args, IPM) {
		const id = args[0];

		const badge = await IPM.fetch(`https://badges.roblox.com/v1/badges/${id}`);
		if (!badge.id) {
			return message.channel.send(await reportRblxErr(badge));
		}
		const icon = (await IPM.fetch(`https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=Png`)).data[0].imageUrl;

		const embed = new Discord.MessageEmbed()
			.setTitle(badge.name)
			.setURL(`https://www.roblox.com/badges/${id}`)
			.setThumbnail(icon)
			.setDescription(badge.description)
			.addField('Rarity', `${badge.statistics.winRatePercentage * 100}%`, true)
			.addField('Won Yesterday', badge.statistics.pastDayAwardedCount, true)
			.addField('Won Ever', badge.statistics.awardedCount, true);
		return message.channel.send(embed);
	},
};
