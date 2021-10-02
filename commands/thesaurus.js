const { thesaurusKey } = require('../config.json');
const Discord = require('discord.js');
const pageHelper = require('../pageHelper');

module.exports = {
	name: 'thesaurus',
	description: 'Use a thesaurus',
	category: 'utility',
	async execute(message, args, IPM) {
		const params = new URLSearchParams({
			key: thesaurusKey,
		});
		const responses = await IPM.fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${args.join(', ')}?${params.toString()}`);
		const list = [];
		responses.forEach(async (response, responseindex) =>{
			const embed = new Discord.MessageEmbed()
				.setAuthor('Merriam-Webster\'s Collegiate® Thesaurus', 'https://dictionaryapi.com/images/MWLogo_58x58.png')
				.setTitle(response.hwi.hw)
				.setDescription(`**${response.fl.toUpperCase()}**`)
				.setFooter('Powered by dictionaryapi.com');
			if (response.meta.syns[0]) {
				embed.addField('Synonyms', response.meta.syns[0].join(', '));
			}
			if (response.meta.ants[0]) {
				embed.addField('Antonyms', response.meta.ants[0].join(', '));
			}
			response.shortdef.forEach(async (def, index) =>{
				embed.addField(`${index + 1}.`, def);
			});
			list[responseindex] = embed;
		});
		message.reply({ embeds: [list[0]], allowedMentions: { repliedUser: false } }).then(async newMessage =>{
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage, true);
			await PageHelper.start(list);
		});
	},
};
