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
	name: 'kick',
	description: 'Kick a user',
	category: 'moderation',
	args: true,
	permissions: 'KICK_MEMBERS',
	async execute(message, args) {
		return;
		const member = await getUserFromMention(args[0]);
		member.kick().then(message.react('✅'));
	},
};
