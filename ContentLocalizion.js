const translate = require('@vitalets/google-translate-api');
const noTranslateRegExp = /<notranslate>|<\/notranslate>/g;

class ContentLocalization {
	constructor(translateTo) {
		this.translateTo = translateTo;
	}
	async translateEmbed(embed) {
		for (const key in embed) {
			const value = embed[key];
			if (typeof value == 'string') {
				const matches = [...value.matchAll(noTranslateRegExp)].map(a => a.index);
				if (matches.length > 0) {
					console.log(matches);
				}
			}
		}
		return embed;
	}
}
module.exports = ContentLocalization;