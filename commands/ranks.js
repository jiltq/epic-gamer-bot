const moment = require('moment');
const Discord = require('discord.js');
const messageWeight = 0.25;
const timeWeight = 0;
const commandWeight = 0.75;
const debug_log = false;


module.exports = {
	name: 'ranks',
	description: 'Ranks of users in the server!',
	args: false,
	usage: '[number of members to show]',
	async execute(message, args, IPM) {
		let numToDisplay = args[0];
		const client = message.client;
		client.guilds.fetch('696079746697527376')
			.then(async guild =>{
				const requiredRole = await guild.roles.fetch('747547541695889651');

				const members = requiredRole.members.array();
				if (numToDisplay == 'all') numToDisplay = members.length;
				if (!numToDisplay) numToDisplay = 5;
				if (numToDisplay > members.length) numToDisplay = members.length;
				const jsonData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/autoRankData.json');
				const rankObject = {};
				const memberBoosts = {};
				members.forEach(async member =>{
					memberBoosts[member.id] = jsonData[member.id].boost;
				});
				const averageMemberBoost = jsonData.boostAverage;
				members.forEach(async member =>{
					const memberBoost = memberBoosts[member.id];
					const fromAverageBoost = memberBoost / averageMemberBoost;
					rankObject[member.id] = {
						'totalRankNum': fromAverageBoost,
						'member': member,
					};
				});
				let rankArray = Object.values(rankObject);
				rankArray = rankArray.sort(function(a, b) {return b.totalRankNum - a.totalRankNum;});
				const memberArray = rankArray.map(rank => rank.member.displayName);
				memberArray.forEach((name, index) =>{
					const rankArrayRaw = Object.values(rankObject);
					const pos = rankArray.map(function(e) { return e.member.displayName; }).indexOf(name) + 1;
					const num = rankArray[pos - 1].totalRankNum.toFixed(2);
					const member = rankArray[pos - 1].member;
					if (pos == 1) {
						memberArray[index] = `🥇 #${pos} **${num}** - ${name}\n`;
					}
					else if (pos == 2) {
						memberArray[index] = `🥈 #${pos} **${num}** - ${name}\n`;
					}
					else if (pos == 3) {
						memberArray[index] = `🥉 #${pos} **${num}** - ${name}\n`;
					}
					else if (pos >= 4 && pos <= numToDisplay) {
						if (pos > (memberArray.length / 2)) {
							memberArray[index] = `🔹 #${pos} **${num}** - ${name}\n`;
						}
						else {
							memberArray[index] = `🔷 #${pos} **${num}** - ${name}\n`;
						}
					}
					else {
						memberArray[index] = '';
					}
					if (member.id == '401576485741264896' && pos >= 4 && pos <= numToDisplay) {
						memberArray[index] = `🦎 #${pos} **${num}** - ${name}\n`;
					}
				});
				const embed = new Discord.MessageEmbed()
					.setTitle('Ranks for Epic Gamers')
					.setDescription(memberArray);
				message.channel.send(embed);
			});
	},
};
