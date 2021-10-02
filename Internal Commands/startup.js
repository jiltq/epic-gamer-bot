const fs = require('fs');
const Discord = require('discord.js');
const package = require('../package.json');
const config = require('../config.json');
const clientm = require('../databases/client.js');
const IPM = require('../IPM.js');
const utility = require('../utility.js');
const userdatamanager = require('../userdatamanager.js');
const visuals = require('../visuals.js');

const fixedUpdate = require('../Internal Commands/fixedupdate.js');

/*
	Internal command module for executing startup functions
*/

module.exports = {
	name: 'startup',
	async execute(client) {
		IPM.edit_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/data.json', 'playing', false);

		if (client.user.username != config.username) {
			client.user.setUsername(config.username).catch(err => console.log('\x1b[31m%s\x1b[0m', err.message));
		}
		client.internalCommands.get('UpdateStatus').execute(client);
		client.internalCommands.get('subscriptionnotifer').execute({ 'client': client, 'IPM': IPM });
		fixedUpdate.fixedUpdateTrigger({ 'client': client, 'IPM': IPM });
		client.internalCommands.get('queueloop').execute(client);
		client.internalCommands.get('EventLoop').execute(client);
	},
};
