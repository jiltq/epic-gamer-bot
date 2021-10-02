const translate = require('@vitalets/google-translate-api');
const Discord = require('discord.js');
const languages = require('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/node_modules/@vitalets/google-translate-api/languages.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const enchanting_table_language = {
	'a': 'ᔑ',
	'b': 'ʖ',
	'c': 'ᓵ',
	'd': '↸',
	'e': 'ᒷ',
	'f': '⎓',
	'g': '⊣',
	'h': '⍑',
	'i': '╎',
	'j': '⋮',
	'k': 'ꖌ',
	'l': 'ꖎ',
	'm': 'ᒲ',
	'n': 'リ',
	'o': '𝙹',
	'p': '!¡',
	'q': 'ᑑ',
	'r': '∷',
	's': 'ᓭ',
	't': 'ℸ',
	'u': '⚍',
	'v': '⍊',
	'w': '∴',
	'x': ' ̇/',
	'y': '||',
	'z': '⨅',
};
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] == value);
}
async function translateToEnchanting(text, fromLanguage, message) {
	let newText = text;
	Object.keys(enchanting_table_language)
		.forEach(async letter =>{
			const re = new RegExp(letter, 'gi');
			newText = newText.replace(re, enchanting_table_language[letter]);
		});
	let flagFrom = `:flag_${fromLanguage}:`;
	let flagTo = '';
	if (flagFrom == ':flag_en:') flagFrom = ':flag_us:';
	if (flagTo == ':flag_en:') flagTo = ':flag_us:';
	const embed = new Discord.MessageEmbed()
		.addField(trim(`${flagFrom} ${languages[fromLanguage]}`, 256), trim(text, 1024), true)
		.addField(trim(`${flagTo} Enchanting Table Language`, 256), trim(newText, 1024), true)
		.setFooter('powered by @vitalets/google-translate-api');
	message.channel.send(embed);
}
async function translateFromEnchanting(text, message, toLanguage) {
	let newText = text;
	Object.values(enchanting_table_language)
		.forEach(async enchant_letter =>{
			const re = new RegExp(enchant_letter, 'gi');
			newText = newText.replace(re, getKeyByValue(enchanting_table_language, enchant_letter));
		});
	const translateTo = languages.getCode(toLanguage);
	translate(newText, { from: 'auto', to: toLanguage }).then(res => {
		let flagFrom = `:flag_${res.from.language['iso']}:`;
		let flagTo = `:flag_${translateTo}:`;
		if (flagFrom == ':flag_en:') flagFrom = ':flag_us:';
		if (flagTo == ':flag_en:') flagTo = ':flag_us:';
		const embed = new Discord.MessageEmbed()
			.addField(trim(`${flagFrom} ${languages[res.from.language['iso']]}`, 256), trim(res.from.text.value || newText, 1024), true)
			.addField(trim(`${flagTo} ${languages[translateTo]}`, 256), trim(res.text, 1024), true)
			.setFooter('powered by @vitalets/google-translate-api');
		message.channel.send(embed);
	});
}

module.exports = {
	name: 'translate',
	description: 'translate words or phrases into english',
	usage: '[text to be translated, language to translate from, language to translate to]',
	category: 'utility',
	args: true,
	async execute(message, args, IPM) {
		const text = trim(args[0], 5000);
		let translateFrom = languages.getCode(args[1]);
		if (args[1] == 'Enchanting Table') {
			translateFromEnchanting(text, message, args[2]);
			return;
		}
		if (args[2] == 'Enchanting Table') {
			translateToEnchanting(text, translateFrom || 'en', message);
			return;
		}
		let translateTo = languages.getCode(args[2]);
		if (!translateFrom) translateFrom = 'auto';
		if (!translateTo) translateTo = 'en';
		translate(text, { from: translateFrom, to: translateTo }).then(res => {
			const newText = res.text;
			let flagFrom = `:flag_${res.from.language['iso']}:`;
			let flagTo = `:flag_${translateTo}:`;
			if (flagFrom == ':flag_en:') flagFrom = ':flag_us:';
			if (flagTo == ':flag_en:') flagTo = ':flag_us:';
			const embed = new Discord.MessageEmbed()
				.addField(trim(`${flagFrom} ${languages[res.from.language['iso']]}`, 256), trim(res.from.text.value || text, 1024), true)
				.addField(trim(`${flagTo} ${languages[translateTo]}`, 256), trim(newText, 1024), true)
				.setFooter('powered by @vitalets/google-translate-api');
			message.channel.send({ embeds: [embed] });
		}).catch(error => {
			IPM.execute_internal_command('commanderror', { 'client': message.client, 'error': error, 'message': message });
		});
	},
};
