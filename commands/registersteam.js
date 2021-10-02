const Discord = require('discord.js');
const eventManager = require('../eventManager.js');

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

module.exports = {
	name: 'registersteam',
	description: 'Test for event',
	category: 'dev',
	args: true,
	async execute(message, args) {
		const member = await getUserFromMention(args[0], message.guild);
		const url = args[1];
		await eventManager.registerSteamGames(member.id, url);
	},
};
