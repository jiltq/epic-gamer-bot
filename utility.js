module.exports = {
	randomNumber(min, max) {
		return Math.floor((Math.random() * max) + min);
	},
	async getMemberFromMention(mention, guild) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			const { client } = require(require.main.filename);
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return await guild.members.cache.get(mention);
		}
	},
};
