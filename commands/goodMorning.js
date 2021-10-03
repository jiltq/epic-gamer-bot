const fs = require('fs');
const Discord = require('discord.js');
let lastTime = 0;
const utility = require('../utility.js');
const udm = require('../userdatamanager.js');

const games = require('../JSON/games.json');
const channelID = '855067595861393408';

const Scraper = require('images-scraper');
const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: true },
});

const defaultEmbed = {
	title: 'Good (partofday), (user)!',
	description: 'tip: you can customize or disable your "good (partofday)" message using ?customize_gm!',
};
/*
const backupEmbed = {
	title: 'Good (partofday), (user)!',
	description: 'tip: you can customize or disable your "good (partofday)" message using ?customize_gm!',
};
*/
let partofday = null;

let processing_FG = false;

module.exports = {
	async startup(options) {
		if (!options.client.shardID) throw new Error('No client shard ID passed!');
		const IPM = options.IPM;
		const client = options.client;
		console.log('good morning startup initiated!');
		client.on('presenceUpdate', async (oldPresence, newPresence) =>{
			if (newPresence.member.guild.id != '696079746697527376' && newPresence.member.guild.id != '810280092013428807' || !newPresence.member.roles.cache.map(role => role.id).includes('747547541695889651')) return;
			if (newPresence.activities.length > 0) {
				const activities = newPresence.activities.filter(activity => activity.type == 'PLAYING');
				IPM.execute_internal_command('autoeventlog', { game: activities[0].name, IPM: IPM, activity: activities[0] });
			}
			const d = Date.now();
			const date = new Date();
			const day = date.getDate();
			const month = date.getMonth();
			const year = date.getYear();
			const sessionNum = day * month * year;
			// if ((d - lastTime) < 1000) return;
			// const newdata = JSON.parse(fs.readFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/goodmorningdata.json', 'utf8'));
			const newdata = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/goodmorningdata.json');
			const rankData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/autoRankData.json');
			const rank = rankData[newPresence.member.id] / rankData.boostAverage;
			const num = utility.randomNumber(rank, 1) == 1;
			if (!oldPresence) oldPresence = { 'status': 'offline' };
			if (newdata.lastSessionNum != sessionNum) {
				newdata.lastSessionNum = sessionNum;
				console.log('Good Morning Manager: Reset timer!');
				const users = await udm.getUsers();
				users.forEach(async userID =>{
					await udm.writeProperty(userID, 'isAwake', false);
				});
				if (!processing_FG) {
					processing_FG = true;
					const index = utility.randomNumber(1, games.games.length);
					const gameName = games.games[index];
					console.log(gameName);
					let result = await google.scrape(gameName, 1);
					result = result[0].url;
					console.log(result);
					const embed = new Discord.MessageEmbed()
						.setAuthor('featured game of the day')
						.setTitle(gameName)
						.setImage(result);
					client.channels.fetch(channelID).then(channel =>{
						channel.send(embed);
						processing_FG = false;
					});
				}
			}
			if (newPresence.member.user.bot) return;
			if (oldPresence.status == 'offline' && newPresence.status != 'offline') {
				if (await udm.readProperty(newPresence.member.id, 'dnd')) return;
				if (!await udm.readProperty(newPresence.member.id, 'isAwake')) {
					// if ((d - lastTime) >= 86400000) newdata.usersAwake = [];
					console.log(`Good Morning Manager: Greeted user ${newPresence.member.user.username}!`);
					udm.writeProperty(newPresence.member.id, 'isAwake', true);
					if (date.getHours() >= 12 && date.getHours() < 18) partofday = 'afternoon';
					else if (date.getHours() < 12) partofday = 'morning';
					else if (date.getHours() >= 18) partofday = 'evening';
					if (newdata.userDesigns[newPresence.member.id] == null) {
						const embed = defaultEmbed;
						embed.title = embed.title.replace('(partofday)', partofday);
						embed.title = embed.title.replace('(user)', newPresence.member.user.username);
						embed.description = embed.description.replace('(partofday)', partofday);
						embed.description = embed.description.replace('(user)', newPresence.member.user.username);
						newPresence.member.send({ embed: embed });
						console.log(embed);
					}
					else if (newdata.userDesigns[newPresence.member.id] != null) {
						const embed = newdata.userDesigns[newPresence.member.id];
						embed.title = embed.title.replace('(partofday)', partofday);
						embed.title = embed.title.replace('(user)', newPresence.member.user.username);
						embed.description = embed.description.replace('(partofday)', partofday);
						embed.description = embed.description.replace('(user)', newPresence.member.user.username);
						console.log('user has customized thing');
						newPresence.member.send({ embed: embed });
						console.log(embed);
					}
					/*
					const embed = new Discord.MessageEmbed();
					if (date.getHours() >= 12 && date.getHours() < 18) {
						embed.setTitle(`Good afternoon, ${newPresence.member.user.username}!`);
						embed.setFooter('tip: you can customize or disable your "good afternoon" message using ?customize_gm!');
					}
					else if (date.getHours() < 12) {
						embed.setTitle(`Good morning, ${newPresence.member.user.username}!`);
						embed.setFooter('tip: you can customize or disable your "good morning" message using ?customize_gm!');
					}
					else if (date.getHours() >= 18) {
						embed.setTitle(`Good evening, ${newPresence.member.user.username}!`);
						embed.setFooter('tip: you can customize or disable your "good evening" message using ?customize_gm!');
					}
					if (newPresence.member.id == '683411880131166234') embed.setTitle('hey sweetcheeks hows it going');
					*/
					partofday = null;
					if (num) {
						const feedbackEmbed = new Discord.MessageEmbed()
							.setTitle('so, how\'s your time been in epic gamers?')
							.setDescription('be sure to send jiltq your feedback! :)');
						newPresence.member.send(feedbackEmbed);
					}
					// newdata.userDesigns[newPresence.member.id] = embed;
				}
			}
			fs.writeFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/goodmorningdata.json', JSON.stringify(newdata));
			const nd = Date.now();
			lastTime = nd;
			partofday = null;
		});
	},
};
