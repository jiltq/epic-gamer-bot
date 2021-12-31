const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

class Commands {
	constructor(path) {
		this.commands = new Discord.Collection();
		this.cooldowns = new Discord.Collection();
		const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`${path}${file}`);
			this.commands.set(command.name, command);
		}
	}
	async getTheFuckingCommand(commandName) {
		return this.commands.get(commandName);
	}
	async parse(message, internal = false) {
		if (!message.content.startsWith(config.prefix) || message.author.bot) {
			return {
				command: { notReal: true, execute: async () =>{
					return;
				} },
				args: [],
			};
		}
		const commandName = message.content.slice(config.prefix.length).trim().split(' ')[0].toLowerCase();
		let args = message.content.slice(config.prefix.length + commandName.length).trim().split(',');
		args.forEach(async (arg, index) =>{
			arg.length != 0 ? args[index] = arg.trim() : args = args.filter($arg => $arg != arg);
		});
		let command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			command = {
				notReal: true,
				execute: async function() {
					return;
				},
			};
		}
		else if (command.internal && !internal) {
			command = {
				notReal: true,
				execute: async function() {
					return;
				},
			};
		}
		else if (args.length == 0 && command.args) {
			command = {
				notReal: true,
				execute: async function() {
					return;
				},
			};
		}
		return {
			command: command,
			args: args,
		};
	}
	async cooldown(command, message) {
		if (command.notReal || message.author.bot) return;
		if (!this.cooldowns.has(command.name)) {
			this.cooldowns.set(command.name, new Discord.Collection());
		}

		const timestamps = this.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (Date.now() < expirationTime) {
				const timeLeft = (expirationTime - Date.now()) / 1000;
				const embed = new Discord.MessageEmbed()
					.setTitle('slow down dude')
					.setDescription(`you gotta wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command`);
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
		}
		timestamps.set(message.author.id, Date.now());
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		return false;
	}
}
module.exports = Commands;