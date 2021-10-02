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
	name: 'ban',
	description: 'Ban a user',
	category: 'moderation',
	args: true,
	permissions: 'BAN_MEMBERS',
	usage: '[member mention, number of days of messages to delete, reason]',
	async execute(message, args) {
		const member = await getUserFromMention(args[0]);
		const days = parseInt(args[1]) || 0;
		const reason = args[2] || 'You have been banned';
		member.ban({ days: days, reason: reason });
		message.react('✅');
	},
};
