const fetch = require('node-fetch');
const Discord = require('discord.js');
const { token } = require('../config');

/*
	Fetch and send a random cat picture

	Created 8/26/2020 by jiltq
*/

module.exports = {
	name: 'slashcommands',
	description: 'picture of cat',
	category: 'dev',
	creator: { 'name': 'jiltq' },
	async execute(message, args, IPM) {
		const apiEndpoint = 'https://discord.com/api/v8/applications/700455539557269575/guilds/696079746697527376/commands';
		const commands = await IPM.return_commands();
		console.log(Array.from(commands.values()));
		Array.from(commands.values()).forEach(e);
		async function e(item, index) {
			const something = {};
			something.name = item.name;
			something.description = item.description;
			something.options = item.slash_command_options || null;

			const response = await fetch(apiEndpoint, {
				method: 'post',
				body: JSON.stringify(something),
				headers: {
					'Authorization': 'Bot ' + token,
					'Content-Type':'application/json',
				},
			});
			const json = await response.json();

			console.log(json);
		}
	},
};
