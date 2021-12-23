const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const logHelper = require('../logHelper.js');
const chalk = require('chalk');

const chatChannel = '816126601184018472';
const egId = '696079746697527376';

const descriptionProperties = [
	'details',
	'platform',
	'state',
];

const gameConnections = {
	roblox: {
		'401576485741264896': '1361842178', // bman
		'536344399492284439': '122854385', // cheez
		'469879203584540682': '373957757', // jeg
		'695662672687005737': '1672788599', // jiltq
		'672546414642987040': '49764578', // jerry
	},
};

const typeReformat = {
	PLAYING: 'playing',
	STREAMING: 'streaming',
	LISTENING: 'listening to',
	WATCHING: 'watching',
	CUSTOM: '',
	COMPETING: 'competing in',
};

const lastPresence = {

};

module.exports = {
	name: 'presenceUpdate',
	async execute(oldPresence, newPresence) {
		if (newPresence.user.bot || newPresence.member.guild.id != egId) return;
		const json = new Json(`${process.cwd()}/JSON/userConnections.json`);
		const data = await json.read();

		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

		if (!userData.users[newPresence.user.id]) {
			userData.users[newPresence.user.id] = { games: [] };
		}
		/*
		if (!userData.users[newPresence.user.id].statusUpdates) {
			userData.users[newPresence.user.id].statusUpdates = [];
		}
		*/
		if (!userData.users[newPresence.user.id].gameUpdates) {
			userData.users[newPresence.user.id].gameUpdates = [];
		}

		const followers = Object.entries(data.users).filter(user => user[1].following.includes(newPresence.user.id)).map(user => user[0]);
		const followerMembers = [];

		for (let i = 0;i < followers.length;i++) {
			followerMembers[i] = await newPresence.guild.members.fetch(followers[i]);
		}

		const cancelIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/cancel_icon.png`);

		const statusIcons = {
			'online': new Discord.MessageAttachment(`${process.cwd()}/assets/enter_icon.png`, 'online_icon.png'),
			'idle': new Discord.MessageAttachment(`${process.cwd()}/assets/idle_icon.png`),
			'offline': new Discord.MessageAttachment(`${process.cwd()}/assets/leave_icon.png`, 'offline_icon.png'),
			'dnd': new Discord.MessageAttachment(`${process.cwd()}/assets/dnd_icon.png`),
		};
		const statusColors = {
			'online': '#3ba55d',
			'idle': '#faa81a',
			'offline': '#747f8d',
			'dnd': '#ed4245',
		};

		if (!oldPresence) {
			oldPresence = {
				activities: [],
				status: 'offline',
			};
		}

		const newActivity = newPresence.activities.find(activity => !oldPresence.activities.find(activity2 => activity2.name == activity.name));
		const oldActivity = oldPresence.activities.find(activity => !newPresence.activities.find(activity2 => activity2.name == activity.name));

		let update;
		const files = [];
		let row;

		let isImportant = false;

		const embed = new Discord.MessageEmbed()
			.setColor('#2f3136');

		if (newPresence.status != oldPresence.status) {
			update = `is now ${newPresence.status}`;
			files.push(statusIcons[newPresence.status]);
			embed.setThumbnail(`attachment://${newPresence.status}_icon.png`);
			embed.setColor(statusColors[newPresence.status]);

			if ((newPresence.status != 'offline' && oldPresence.status == 'offline') || (newPresence.status == 'offline' && oldPresence.status != 'offline')) {
				isImportant = true;
			}
			/*
			if (newPresence.status != 'offline' && oldPresence.status == 'offline') {
				userData.users[newPresence.user.id].statusUpdates.push({ time: Date.now(), update: 'online' });
			}
			else if (newPresence.status == 'offline' && oldPresence.status != 'offline') {
				userData.users[newPresence.user.id].statusUpdates.push({ time: Date.now(), update: 'offline' });
			}
			*/
		}
		else if (newActivity) {
			if (newActivity.type == 'PLAYING') {
				if (!userData.users[newPresence.user.id].games.find(game => game.name == newActivity.name) && newActivity.type != 'CUSTOM') {
					userData.users[newPresence.user.id].games.push({ name: newActivity.name, timesPlayed: 1 });
				}
				else if (userData.users[newPresence.user.id].games.find(game => game.name == newActivity.name)) {
					userData.users[newPresence.user.id].games.find(game => game.name == newActivity.name).timesPlayed = userData.users[newPresence.user.id].games.find(game => game.name == newActivity.name).timesPlayed + 1;
				}
			}
			isImportant = true;
			update = `is now ${typeReformat[newActivity.type]} ${newActivity.name}`;
			if (newActivity.assets) {
				embed.setThumbnail(newActivity.assets.largeImageURL());
			}
			for (let i = 0; i < descriptionProperties.length; i++) {
				if (newActivity[descriptionProperties[i]]) {
					embed.addField(descriptionProperties[i], newActivity[descriptionProperties[i]]);
				}
			}
			if (data.users[newPresence.user.id]) {
				if (Object.keys(data.users[newPresence.user.id].accounts).length > 0) {
					const gameAccounts = Object.entries(data.users[newPresence.user.id].accounts).filter(account => newActivity.name.toLowerCase().includes(account[0])).slice(-5);
					if (gameAccounts.length > 0) {
						row = new Discord.MessageActionRow();
						for (let i = 0; i < gameAccounts.length; i++) {
							const gameAccount = gameAccounts[i];
							row.addComponents(
								new Discord.MessageButton()
									.setLabel(`${gameAccount[0]} profile`)
									.setURL(gameAccount[1].profileURL)
									.setStyle('LINK'));
						}
					}
				}
			}
			if (newActivity.type == 'PLAYING') {
				userData.users[newPresence.user.id].gameUpdates.push({ time: Date.now(), game: newActivity.name, update: 'startPlaying' });
			}
		}
		else if (oldActivity) {
			if (!userData.users[newPresence.user.id].games.find(game => game.name == oldActivity.name) && oldActivity.type != 'CUSTOM') {
				userData.users[newPresence.user.id].games.push({ name: oldActivity.name, timesPlayed: 1 });
			}
			update = `is no longer ${typeReformat[oldActivity.type]} ${oldActivity.name}`;
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
			userData.users[newPresence.user.id].gameUpdates.push({ time: Date.now(), game: oldActivity.name, update: 'stopPlaying' });
		}
		else if (newPresence.activities.length == 0 && oldPresence.activities.length != 0) {
			update = 'is no longer doing anything';
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
		}
		if (!update) return;
		logHelper.log(module.exports, 'default', `${newPresence.user.username} ${update}`);

		embed
			.setAuthor('status update', newPresence.user.avatarURL())
			.setTitle(`${newPresence.user.username} ${update}`)
			.setFooter(`to stop receiving status updates from ${newPresence.user.username}, use\n"/follow remove ${newPresence.user.toString()}"`);
		if (isImportant) {
			for (let i = 0; i < followerMembers.length; i++) {
				if (followerMembers[i].id == '695662672687005737') {
					await followerMembers[i].send({ embeds: [embed], files: files, components: row ? [row] : [] });
				}
			}
		}
		await userDataJson.write(userData);
	},
};