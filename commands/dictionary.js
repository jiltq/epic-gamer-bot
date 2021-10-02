const { dictionaryKey } = require('../config.json');
const Discord = require('discord.js');
const pageHelper = require('../pageHelper');

module.exports = {
	name: 'dictionary',
	description: 'Use a dictionary',
	category: 'utility',
	async execute(message, args, IPM) {
		const params = new URLSearchParams({
			key: dictionaryKey,
		});
		const responses = await IPM.fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${args.join(', ')}?${params.toString()}`);
		const list = [];
		responses.forEach(async (response, responseindex) =>{
			const embed = new Discord.MessageEmbed()
				.setAuthor('Merriam-Webster\'s Collegiate® Dictionary', 'https://dictionaryapi.com/images/MWLogo_58x58.png')
				.setTitle(response.hwi.hw)
				.setDescription(`**${response.fl.toUpperCase()}**`)
				.setFooter('Powered by dictionaryapi.com');
			response.shortdef.forEach(async (def, index) =>{
				embed.addField(`${index + 1}.`, def);
			});
			embed.addField('Origin', response.date);
			list[responseindex] = embed;
		});
		message.reply({ embeds: [list[0]], allowedMentions: { repliedUser: false } }).then(async newMessage =>{
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage, true);
			await PageHelper.start(list);
		});
	},
};
