const math = require('mathjs');
const Discord = require('discord.js');
const parser = math.parser();

module.exports = {
	name: 'math',
	description: 'calculate expressions!',
	aliases: ['calculate'],
	usage: '[math expression]',
	category: 'utility',
	async execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${args.join(' ')}`)
			.setTitle(`**${parser.evaluate(args.join(' '))}**`)
			.setFooter('powered by mathjs');
		message.channel.send({ embeds: [embed] });
	},
};
