/*
  Epic Gamer Bot updates user info
*/
const moment = require('moment');
const Discord = require('discord.js');

// Configurations
const { auto_update_cooldown } = require('../config.json');
// Weight for variables, for example if a variable has a weight of 0.25 that means 25% of it does not count
const messageWeight = 0.25;
const timeWeight = 0;
const commandWeight = 0.75;
const debug_log = false;
const autoRankServers = ['696079746697527376'];

// Boosts for variables, affects the total boost num which is used to determine a user's rank
const commandBoost = 1.1;
const messageBoost = 1.75;
const timeBoost = 1.5;

// Auto-rank roles
const roles = [
	{
		// Epic Gamer
		'id': '834200684987547708',
		'percentTime': 0.5,
		'percentMessageNum': 0.5,
		'totalNum': 0.5,
	},
	{
		// Uber Gamer
		'id': '834928886303293449',
		'percentTime': 1,
		'percentMessageNum': 1,
		'totalNum': 1,
	},
	{
		// #1 Victory Royale Gamer
		'id': '834929260748865556',
		'percentTime': 1.5,
		'percentMessageNum': 1.5,
		'totalNum': 1.5,
	},
	{
		// Legendary Gamer
		'id': '834929809041391626',
		'percentTime': 2,
		'percentMessageNum': 2,
		'totalNum': 2,
	},
];

async function checkIfDataExists(key, userID, IPM) {
	const fileData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/userData.json');
	const userDataBool = fileData.users[userID] != null;
	if (userDataBool) {
		return fileData.users[userID][key] != null;
	}
	else {
		return false;
	}
}
async function getUserData(key, userID, IPM) {
	if (checkIfDataExists(key, userID, IPM)) {
		const fileData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/userData.json');
		return fileData.users[userID][key];
	}
}

async function updateThoseRanks(options) {
	const client = options.client;
	const IPM = options.IPM;
	client.guilds.fetch('696079746697527376')
		.then(async guild =>{
			const requiredRole = await guild.roles.fetch('747547541695889651');
			/*
			const messages = [];
			const channels = guild.channels.cache.filter(channel => channel.type == 'text').array();
			channels.forEach(async channel =>{
				const channelMessagesRaw = await channel.messages.fetch({ limit: 100 });
				const channelMessages = channelMessagesRaw.array();
				console.log(`${channel.name}: ${channelMessages.length} -- ${channel.position}\n`);
				messages.push(channelMessages.map(message => message.author.id));
			});
			console.log(messages.length || 'e');
			console.log('done');
			return;
			*/
			const members = requiredRole.members.array();
			if (!members) return;
			const jsonData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/autoRankData.json');
			let sum = 0;
			let i;
			const numArray = Object.values(jsonData.messagesPerUser);

			for (i = 0; i < numArray.length; i++) {
				numArray[i] = parseFloat(numArray[i]);
				sum = sum + numArray[i];
			}
			const averageMessageNum = sum / numArray.length;
			if (debug_log) {
				console.log('----------');
				console.log('MESSAGE PROCESSING COMPLETE');
				console.log(`AVERAGE: ${averageMessageNum}`);
				console.log('----------');
			}
			const memberBoosts = {};
			members.forEach(async member =>{
				if (!jsonData.messagesPerUser[member.id]) {
					jsonData.messagesPerUser[member.id] = 0;
				}
				const guildTime = Math.abs(moment.utc(member.guild.createdTimestamp).diff(Date.now()));
				const guildTimeCreated = Date.now() - guildTime;
				const memberTime = Math.abs(moment.utc(member.joinedTimestamp).diff(Date.now()));
				const memberTimeCreated = Date.now() - memberTime;
				if (member.roles.cache.map(role => role.id).includes('747547541695889651')) {
					const timeMemberNotPresent = Math.abs(guildTimeCreated - memberTimeCreated); // guild create time of 1 and member create time of 5 means value of 4
					const notPresentTimePercent = memberTime / timeMemberNotPresent; // not present time equated of 2 and not present time of 4 means value of 0.5
					const numOfMessages = jsonData.messagesPerUser[member.id];
					const messageNumPercent = numOfMessages / averageMessageNum;
					let commands = 0;
					let commandboost = 0;
					const messageboost = numOfMessages * messageBoost;
					const timeboost = (memberTime / 2.6280E+9) * timeBoost;
					if (jsonData[member.id]) {
						if (jsonData[member.id].commandsExecuted) {
							commands = jsonData[member.id].commandsExecuted;
							commandboost = commands * commandBoost;
						}
					}
					else {
						jsonData[member.id] = {};
					}
					let boostNum = 1;
					boostNum += (boostNum * (commandboost + messageboost + timeboost));
					memberBoosts[member.id] = boostNum;

					// const totalRankNum = ((notPresentTimePercent - (notPresentTimePercent * timeWeight)) + (messageNumPercent - (messageNumPercent * messageWeight))) / 2;
				}
			});
			const memberBoostArray = Object.values(memberBoosts);

			let boostSum = 0;
			for (i = 0; i < memberBoostArray.length; i++) {
				boostSum = boostSum + memberBoostArray[i];
			}
			const averageMemberBoost = boostSum / memberBoostArray.length;
			members.forEach(async member =>{
				const memberBoost = memberBoosts[member.id];
				const fromAverageBoost = memberBoost / averageMemberBoost;
				roles.forEach(async role =>{
					const fetchedRole = await guild.roles.fetch(role.id);
					if (!fetchedRole) return console.log(':(');
					if (fromAverageBoost >= role.totalNum) {
						if (!fetchedRole.members.has(member.id)) {
							member.roles.add(fetchedRole, 'User met requirements for this rank, so it was given to them');
							const embed = new Discord.MessageEmbed()
								.setColor('#007F00')
								.setAuthor('Auto-ranking System')
								.setTitle(`🎉hooray, you earned the \`${fetchedRole.name}\` rank!🎉`)
								.setFooter('make sure you don\'t lose your position!');
							member.send(embed);
							console.log(`Added role ${fetchedRole.name} to user ${member.displayName}`);
						}
					}
					else if (member.roles.cache.has(fetchedRole.id)) {
						member.roles.remove(fetchedRole, 'User did not meet requirements for this rank, so it was removed from them');
						const embed = new Discord.MessageEmbed()
							.setColor('#7F0000')
							.setAuthor('Auto-ranking System')
							.setTitle(`oof, you lost your \`${fetchedRole.name}\` rank!`);
						member.send(embed);
					}
				});
				if (jsonData[member.id]) {
					jsonData[member.id].boost = memberBoost;
				}
			});
			jsonData.boostAverage = averageMemberBoost;
			IPM.write_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/autoRankData.json', jsonData);
			const date = new Date();
			console.log('\x1b[32m%s\x1b[0m', `${date.getHours()}:${date.getMinutes()} Auto Rank Manager: Successfully updated client ${client.shardID}'s auto rankings`);
		});
}
module.exports = {
	name: 'userconfig',
	internal: true,
	async execute(options) {
		if (!options.client.shardID) throw new Error('No client shard ID passed!');
		updateThoseRanks(options);
		setInterval(function() {updateThoseRanks(options);}, auto_update_cooldown);
	},
};
