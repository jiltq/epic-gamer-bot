const { prefix } = require('../config.json');
const Discord = require('discord.js');
const embedHelper = require('../embedHelper');

const errorEmbed = new embedHelper.ErrorEmbed(Discord);

const missingString = 'Missing :(';

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	args: false,
	async execute(message, args, IPM) {
		let is_category;let is_command;

		const categorydata = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/categorydata.json');

		const { commands } = message.client;
		const categories = commands.map(command => command.category).filter(category => category != null);

		const distinctCategories = categories.reduce(function(uniqueArray, elem) {
			return uniqueArray.includes(elem) ? uniqueArray : [ ...uniqueArray, elem];
		}, []);

		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${message.client.user.username} commands`);
			for (let i = 0; i < distinctCategories.length; i++) {
				embed.addField(categorydata.categories[distinctCategories[i]] || missingString, `\`${prefix}help ${distinctCategories[i]}\``, true);
			}
			embed.setFooter(`Over ${Math.round(commands.size / 10) * 10}+ commands!`);
			embed.setThumbnail(message.client.user.displayAvatarURL());
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
		}
		else {
			const ecommand = commands.get(args[0].toLowerCase()) || commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));
			is_command = ecommand != null;
			is_category = commands.filter(command => command.category == args[0].toLowerCase()).map(command => command.name).join(', ') != '';
			if (is_command && ecommand.hidden) is_command = false;

			if (is_command) {
				const embed = new Discord.MessageEmbed()
					.setAuthor('command')
					.setTitle(`${prefix}${ecommand.name}`);
				if (ecommand.aliases) embed.addField('aliases', trim(ecommand.aliases.join(', '), 1024));
				if (ecommand.description) embed.addField('description', trim(ecommand.description, 1024));
				if (ecommand.usage) embed.addField('usage', trim(`${prefix}${ecommand.name} ${ecommand.usage}`, 1024));
				if (ecommand.category) embed.addField('category', categorydata.categories[ecommand.category] || ecommand.category);
				embed.addField('cooldown', trim(`${ecommand.cooldown || 3} second(s)`, 1024));
				if (ecommand.creator) embed.addField('creator', trim(ecommand.creator.name, 1024));
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
			else if (is_category) {
				let commands_in_category = commands.filter(command => command.category == args[0].toLowerCase() && !command.hidden).map(command => command.name);
				for (let i = 0; i < commands_in_category.length; i++) {
					commands_in_category[i] = `\`${commands_in_category[i]}\``;
				}
				commands_in_category = commands_in_category.join(', ');
				const embed = new Discord.MessageEmbed()
					.setAuthor('category')
					.setTitle(`${categorydata.categories[args[0].toLowerCase()] || missingString} Commands`)
					.addField('commands', trim(commands_in_category, 1024));
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
			else if (!is_command && !is_category) {
				const embed = await errorEmbed.create('no command or category found!', 'you can also use aliases to search for commands');
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
		}
	},
};
