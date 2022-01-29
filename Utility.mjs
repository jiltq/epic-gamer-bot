class Utility {
	static randomNumber(min, max) {
		return Math.floor((Math.random() * max) + min);
	}
	static async getMemberFromMention(mention, guild) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return await guild.members.cache.get(mention);
		}
	}
	static random(array) {
		if (!array || array.length < 1) return null;
		return array[Math.floor(Math.random() * array.length)];
	}
	static randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}
	static randomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}
	static removeDupes(array) {
		return [...new Set(array)];
	}
	static shuffle(array) {
		let currentIndex = array.length, randomIndex;

		while (currentIndex != 0) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	}
	static clamp(number, min, max) {
		return number >= min ? (number <= max ? number : max) : min;
	}
	static sumOfArray(array) {
		return array.reduce((prev, current) => prev + current);
	}
	static getFavicon(url) {
		return `https://www.google.com/s2/favicons?domain_url=${url}`;
	}
}
module.exports = Utility;