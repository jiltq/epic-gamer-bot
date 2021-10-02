/*
const udm = require('../userdatamanager.js');
const Discord = require('discord.js');

module.exports = {
	name: 'leaderboard',
	description: 'Displays the richest users on the server!',
	category: 'economy',
	async execute(message, args) {
		let numToDisplay = args[0];
		const requiredRole = await message.guild.roles.fetch('747547541695889651');
		const members = requiredRole.members.array();
		if (numToDisplay == 'all') numToDisplay = members.length;
		if (!numToDisplay) numToDisplay = 5;
		if (numToDisplay > members.length) numToDisplay = members.length;
		let wealthEntries = await udm.readProperties('wealth', false, true);
		wealthEntries = wealthEntries.sort(function(a, b) {
			return b[1] - a[1];
		});
		let description = '';
		const embed = new Discord.MessageEmbed()
			.setTitle('Epic Gamers: Richest Gamers');
		for (let i = 0; i < members.length; i++) {
			const section = wealthEntries.find(sect => sect[0] == members[i].id);
			wealthEntries[wealthEntries.indexOf(section)][0] = members[i].displayName;
		}
		const nameArray = wealthEntries.map(entry => entry[0]);
		for (let i = 0; i < nameArray.length; i++) {
			if ((i + 1) <= numToDisplay) {
				const name = nameArray[i];
				const section = wealthEntries.find(sect => sect[0] == name);
				description = description.concat('', `**#${wealthEntries.indexOf(section) + 1}** ${name}: $${section[1]}\n\n`);
			}
		}
		embed.setDescription(description);
		return message.channel.send(embed);
	},
};
*/
