const Discord = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = {
	name: 'urban',
	description: 'consult the urban dictionary for knowledge',
	category: 'fun',
	usage: '[term to search up]',
	creator: { 'name': 'jiltq' },
	slash_command_options: [ { 'name':'term', 'description':'term to search up', 'type':3, 'required':true } ],
	args: true,
	async execute(message, args) {
		urban();
		async function urban() {
			if (!args.length) {
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('no search query given!')
					.setFooter('please provide a search video query');
				return message.channel.send(embed);
			}

			const query = querystring.stringify({ term: args.join(' ') });

			const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
			if (!list.length) {
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('no results found!')
					.setFooter('check your spelling or try different keywords');
				return message.channel.send(embed);
			}

			const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
			const [answer] = list;

			const embed = new Discord.MessageEmbed()
				.setAuthor(answer.word, '', answer.permalink)
				.setDescription(trim(answer.definition || 'error: definition not available', 2048).replace(/\[(.*?)\]/g, '$1'));
			if (trim(answer.example, 1024)) {
				embed.addField('Example', trim(answer.example, 1024).replace(/\[(.*?)\]/g, '$1'));
			}
			if (trim(answer.thumbs_up) && trim(answer.thumbs_down)) {
				embed.addField('Rating', `:thumbup:\`${Math.round((answer.thumbs_up / (answer.thumbs_up + answer.thumbs_down)) * 100) }%\` :thumbdown:\`${Math.round((answer.thumbs_down / (answer.thumbs_up + answer.thumbs_down)) * 100) }%\``);
			}
			message.channel.send({embeds:[embed]});
		}
	},
};