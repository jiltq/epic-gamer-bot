const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

class CommandManager {
	constructor() {

	}
	registerCommandModules(path) {
		const commands = new Collection();
		const commandFiles = fs.readdirSync(`${process.cwd()}/commands`).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`${path}/${file}`);
			if (command.data) {
				commands.set(command.data.name, command);
			}
		}
		return commands;
	}
	async executeCommand(command, interaction) {
		if (command.experimental) {
			if (interaction.options.getSubcommand()) {
				return await command.execution[interaction.options.getSubcommand()](interaction);
			}
			else {
				return await command.execution.main(interaction);
			}
		}
		if (!command.execute) throw new Error('Command does not contain a function named "execute()" to execute!');
		return await command.execute(interaction);
	}
}
class AppCommandManager extends CommandManager {
	constructor(client) {
		super();
		this.client = client;
	}

	/**
     * Register application commands, either globally or for a guild
     * @param {string} path Path to command files
     * @param {boolean} global Whether or not to register global application commands or a guild's
     * @param {string} guildId ID of the guild to register application commands for, if there is one
     */
	async registerCommands(path, global = true, { guildId }) {
		const commands = super.registerCommandModules(path);

		const rest = new REST({ version: '9' }).setToken(this.client.token);
		await rest.put(
			(global ? Routes.applicationCommands(this.client.application.id) : Routes.applicationGuildCommands(this.client.user.id, guildId)),
			{ body: [commands.map(command => command.data.toJSON())] },
		);
	}
}

exports.CommandManager = CommandManager;
exports.AppCommandManager = AppCommandManager;