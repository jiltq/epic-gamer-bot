const Discord = require('discord.js');

const chatChannel = '816126601184018472';
const egId = '696079746697527376';

const descriptionProperties = [
	'details',
	'platform',
	'state',
];

module.exports = {
	name: 'presenceUpdate',
	async execute(oldPresence, newPresence) {
		if (newPresence.user.bot || newPresence.member.guild.id != egId) return;
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

		const embed = new Discord.MessageEmbed()
			.setColor('#2f3136');

		if (newPresence.status != oldPresence.status) {
			update = `is now ${newPresence.status}`;
			files.push(statusIcons[newPresence.status]);
			embed.setThumbnail(`attachment://${newPresence.status}_icon.png`);
			embed.setColor(statusColors[newPresence.status]);
		}
		else if (newActivity) {
			update = `is now ${newActivity.type.toLowerCase()} ${newActivity.name}`;
			if (newActivity.assets) {
				embed.setThumbnail(newActivity.assets.largeImageURL());
			}
			for (let i = 0; i < descriptionProperties.length; i++) {
				if (newActivity[descriptionProperties[i]]) {
					embed.addField(descriptionProperties[i], newActivity[descriptionProperties[i]]);
				}
			}
		}
		else if (oldActivity) {
			update = `is no longer ${oldActivity.type.toLowerCase()} ${oldActivity.name}`;
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
		}
		else if (newPresence.activities.length == 0 && oldPresence.activities.length != 0) {
			update = 'is no longer playing anything';
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
		}
		if (!update) return;

		embed
			.setAuthor('status update', newPresence.user.avatarURL())
			.setTitle(`${newPresence.user.username} ${update}`);
		const chat = await newPresence.client.channels.fetch(chatChannel);
		if (chat) {
			await chat.send({ embeds: [embed], files: files });
		}
	},
};