const Discord = require('discord.js');

async function getUserFromMention(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		const { client } = require(require.main.filename);
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return await guild.members.cache.get(mention);
	}
}

module.exports = {
	name: 'rank',
	description: 'Returns a member\'s rank',
	usage: '[member mention]',
	args: false,
	async execute(message, args, IPM) {
		const client = message.client;
		client.guilds.fetch('696079746697527376')
			.then(async guild =>{
				let member = await getUserFromMention(args[0], guild);
				if (!member) member = message.member;
				const requiredRole = await guild.roles.fetch('747547541695889651');
				const members = requiredRole.members.array();
				const jsonData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/autoRankData.json');
				const rankObject = {};
				const memberBoosts = {};
				members.forEach(async emember =>{
					memberBoosts[emember.id] = jsonData[emember.id].boost;
				});
				const averageMemberBoost = jsonData.boostAverage;
				members.forEach(async emember =>{
					const memberBoost = memberBoosts[emember.id];
					const fromAverageBoost = memberBoost / averageMemberBoost;
					rankObject[emember.id] = {
						'totalRankNum': fromAverageBoost,
						'member': emember,
					};
				});
				let rankArray = Object.values(rankObject);
				rankArray = rankArray.sort(function(a, b) {return b.totalRankNum - a.totalRankNum;});
				const pos = rankArray.map(function(e) { return e.member.id; }).indexOf(member.id);
				const embed = new Discord.MessageEmbed()
					.setAuthor(member.displayName, member.user.displayAvatarURL())
					.setTitle(`Rank: **#${pos + 1}** place`);
				message.channel.send(embed);
			});
	},
};
