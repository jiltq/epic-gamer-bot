const config = require('../config.json');

const fixedUpdate = require('../commands/fixedupdate.js');

module.exports = {
	name: 'startup',
	internal: true,
	async execute(client) {
		if (client.user.username != config.username) {
			client.user.setUsername(config.username).catch(err => console.log('\x1b[31m%s\x1b[0m', err.message));
		}
		client.internalCommands.get('UpdateStatus').execute(client);
		client.internalCommands.get('subscriptionnotifer').execute({ 'client': client });
		fixedUpdate.fixedUpdateTrigger({ 'client': client });
		client.internalCommands.get('queueloop').execute(client);
		client.internalCommands.get('EventLoop').execute(client);
	},
};
