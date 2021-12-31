const { isMainThread, workerData, parentPort } = require('worker_threads');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');
const fs = require('fs');
const { Client, Intents } = require('discord.js');

const { method, serverId } = workerData;

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.data) {
		commands.push(command.data.toJSON());
	}
}

module.exports = {
	name: 'Slash Command Manager',
};
const methods = {
	refresh: async function() {
		const rest = new REST({ version: '9' }).setToken(token);
		try {
			await rest.put(
				Routes.applicationGuildCommands(clientId, serverId),
				{ body: commands },
			);

			parentPort.postMessage({ status: 'success' });
		}
		catch (error) {
			parentPort.postMessage({ status: 'error', error: error });
		}
	},
	getCommandData: function() {
		parentPort.postMessage({ status: 'success', data: commands });
	},
	refreshCommandPermissions: async function() {
		console.log(commands);
		const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
		await client.login(token);
		const guild = await client.guilds.fetch(serverId);
		const appCommands = await guild.commands.fetch(clientId);
		console.log(appCommands);
		for (const command of commands) {
			console.log('a');
		}
	},
};

if (!isMainThread) {
	parentPort.postMessage({ status: 'start' });
	methods[method]();
}