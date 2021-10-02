const Discord = require('discord.js');
const max = 100;

const lvl0 = num => num < max && num > 5;
const lvl1 = num => num < 5 && num > 3.75;
const lvl2 = num => num < 3.75 && num > 0.9375;
const lvl3 = num => num < 0.9375 && num > 0;

async function getUserFromMention(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return await guild.members.cache.get(mention);
	}
}

const level0 = [
	'was bonked',
	'shared their opinion online',
	'slipped on a banana',
	'stared at the sun for too long',
	'ate too much rotten flesh and didn\'t heal fast enough',
	'violated twitch\'s TOS',
];
const level1 = [
	'got hit by a car',
	'was dissected',
	'suffocated from smoke inhalation',
	'stuck a fork in an outlet',
];
const level2 = [
	`jumped off of the roof of a building and fell ${Math.floor((Math.random() * 84) + 48)} feet onto the ground, instantly breaking their spine upon impact`,
	'got caught in active machinery and had their arms removed, eventually dying of blood loss',
	'had their throat slit',
];
const level3 = [
	'hung themself in their bedroom in front of the window',
	'locked themselves in their garage with a running car inside',
];

module.exports = {
	name: 'kill',
	description: 'Kill somebody!',
	category: 'fun',
	args: true,
	async execute(message, args) {
		const member = await getUserFromMention(args[0], message.guild);
		const random = Math.random() * max;
		console.log(random);
		if (lvl0(random)) {
			const index = Math.floor((Math.random() * level0.length) + 0);
			return message.channel.send({ content: `${member.user.username} ${level0[index]}` });
		}
		else if (lvl1(random)) {
			const index = Math.floor((Math.random() * level1.length) + 0);
			return message.channel.send({ content: `${member.user.username} ${level1[index]}` });
		}
		else if (lvl2(random)) {
			const index = Math.floor((Math.random() * level2.length) + 0);
			return message.channel.send({ content: `${member.user.username} ${level2[index]}` });
		}
		else if (lvl3(random)) {
			const index = Math.floor((Math.random() * level3.length) + 0);
			return message.channel.send({ content: `${member.user.username} ${level3[index]}` });
		}
	},
};
