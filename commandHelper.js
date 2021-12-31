const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const logHelper = require('./logHelper.js');

module.exports = {
	name: 'commandHelper',
	CommandHelper: class CommandHelper {
		constructor({ path, client }) {
			this.client = client;
			this.commands = new Discord.Collection();
			this.cooldowns = new Discord.Collection();
			const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const command = require(`${path}/${file}`);
				if (command.data) {
					this.commands.set(command.data.name, command);
				}
			}
		}
		async returnCommands() {
			return this.commands;
		}
		async refreshAppCommands(guildId) {
			logHelper.log(module.exports, 'default', 'refreshing application (/) commands..');
			const rest = new REST({ version: '9' }).setToken(this.client.token);
			await rest.put(
				Routes.applicationGuildCommands(this.client.user.id, guildId),
				{ body: this.commands.map(command => command.data.toJSON()) },
			)
				.then(async () => logHelper.log(module.exports, 'success', 'successfully refreshed application (/) commands'))
				.catch(async error => logHelper.log(module.exports, 'error', `failed to refresh application (/) commands\n${error}`));
		}
		async removeGuildCommands(guildId) {
			const rest = new REST({ version: '9' }).setToken(this.client.token);
			await rest.put(
				Routes.applicationGuildCommands(this.client.user.id, guildId),
				{ body: [] },
			);
		}
		async refreshGlobalCommands() {
			logHelper.log(module.exports, 'default', 'refreshing application (/) commands..');
			const guilds = this.client.guilds.cache;
			const rest = new REST({ version: '9' }).setToken(this.client.token);
			await rest.put(
				Routes.applicationCommands(this.client.user.id),
				{ body: [] },
			);
			guilds.each(async guild =>{
				await rest.put(
					Routes.applicationGuildCommands(this.client.user.id, guild.id),
					{ body: this.commands.map(command => command.data.toJSON()) },
				);
			});
			console.log('done');
		}
		async refreshAppCommandPermissions(guildId) {
			logHelper.log(module.exports, 'default', 'refreshing application (/) command permissions..');
			const guild = await this.client.guilds.fetch(guildId);
			const allAppCommands = await guild.commands.fetch();
			const appCommands = allAppCommands.filter(appCommand => appCommand.applicationId == '700455539557269575');
			appCommands.each(async appCommand => {
				const command = this.commands.get(appCommand.name);
				if (command) {
					if (command.defaultPermission != null) {
						await appCommand.setDefaultPermission(command.defaultPermission);
						console.log(`set default permission for /${command.data.name}`);
					}
					if (command.permissions) {
						await appCommand.permissions.set({ permissions: command.permissions });
						console.log(`set permissions for /${command.data.name}`);
					}
				}
			});
			logHelper.log(module.exports, 'success', 'successfully refreshed application (/) command permissions');
		}
		async refreshGlobalCommandPermissions() {
			logHelper.log(module.exports, 'default', 'refreshing application (/) command permissions..');
			/*
			const guilds = await this.client.guilds.cache;
			guilds.each(async guild =>{
				console.log(`current guild: ${guild.name}`);
				const allAppCommands = await guild.commands.fetch();
				const appCommands = allAppCommands.filter(appCommand => appCommand.applicationId == '700455539557269575');
				appCommands.each(async appCommand => {
					const command = this.commands.get(appCommand.name);
					if (command) {
						if (command.defaultPermission != null) {
							await appCommand.setDefaultPermission(command.defaultPermission);
							console.log(`set default permission for /${command.data.name}`);
						}
						if (command.permissions) {
							await appCommand.permissions.set({ permissions: command.permissions });
							console.log(`set permissions for /${command.data.name}`);
						}
					}
				});
			});
			*/
			const allAppCommands = await this.client.application.commands.fetch();
			const appCommands = allAppCommands.filter(appCommand => appCommand.applicationId == '700455539557269575');
			const guilds = await this.client.guilds.cache;
			const formattedCommands = this.commands.filter(command => command.permissions).map(command =>{
				const match = appCommands.find(appCommand => appCommand.name == command.data.name);
				if (match) {
					return {
						id: match.id,
						permissions: command.permissions,
					};
				}
			});
			console.log(formattedCommands);
			guilds.each(async guild =>{
				await guild.fetch();
				console.log(`current guild: ${guild.name}`);
				await guild.commands.permissions.set({ fullPermissions: formattedCommands });
			});
			logHelper.log(module.exports, 'success', 'successfully refreshed application (/) command permissions');
		}
	},
};