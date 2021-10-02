const Discord = require('discord.js');

function capitalize(phrase) {
	return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

module.exports = {
	name: 'mypresence',
	description: 'display your current presence',
	async execute(message, args) {
		const presence = message.member.presence;
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.member.displayName}'s presence`)
			.setThumbnail(message.author.avatarURL())
			.addField('Status', capitalize(presence.status), true);

		switch(presence.status) {
		case 'online':
			embed.setColor([59, 165, 92]);
			break;
		case 'idle':
			embed.setColor([250, 166, 26]);
			break;
		case 'offline':
			embed.setColor([116, 127, 141]);
			break;
		case 'dnd':
			embed.setColor([237, 66, 69]);
			break;
		}
		if (presence.activities.length) {
			if (presence.activities[0]) {
				const activity = presence.activities[0];
				embed.addField('Activity', `${capitalize(activity.type.toLowerCase())} ${activity.name}`, true);
				if (activity.assets.largeImage) {
					embed.setImage(activity.assets.largeImageURL());
				}
				if (activity.assets.smallImage) {
					embed.setThumbnail(activity.assets.smallImageURL());
				}
			}
		}
		message.channel.send(embed);
	},
};
