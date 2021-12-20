const { isMainThread, workerData, parentPort } = require('worker_threads');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, defaultServerId } = require('./config.json');
const fs = require('fs');

const { method } = workerData;

module.exports = {
	name: 'Slash Command Manager',
};
const methods = {
	refresh: async function() {
		const commands = [];
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			if (command.data) {
				commands.push(command.data.toJSON());
			}
		}
		const rest = new REST({ version: '9' }).setToken(token);
		try {
			await rest.put(
				Routes.applicationGuildCommands(clientId, defaultServerId),
				{ body: commands },
			);

			parentPort.postMessage({ status: 'success' });
		}
		catch (error) {
			parentPort.postMessage({ status: 'error', error: error });
		}
	},
	getCommandData: function() {
		const commands = [];
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			if (command.data) {
				commands.push(command.data.toJSON());
			}
		}
		parentPort.postMessage({ status: 'success', data: commands });
	},
};

if (!isMainThread) {
	parentPort.postMessage({ status: 'start' });
	methods[method]();
}