module.exports = {
	randomNumber(min, max) {
		return Math.floor((Math.random() * max) + min);
	},
	async getMemberFromMention(mention, guild) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return await guild.members.cache.get(mention);
		}
	},
	random(array) {
		if (!array || array.length < 1) return null;
		return array[Math.floor(Math.random() * array.length)];
	},
	removeDupes(array) {
		return [...new Set(array)];
	},
};
