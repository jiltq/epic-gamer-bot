const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
const visuals = require('./visuals.js');
const CommandHelper = require('./commandHelper.js');

const fs = require('fs');

module.exports = {
	name: 'Bot File',
};

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS];

const client = new Client({ intents: intents });
const Events = require('./eventHelper.js');
(new Events(__dirname + '/events/')).listen(client);

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.data) {
		client.commands.set(command.data.name, command);
	}
}

client.login(token)
	.catch($error=>{
		visuals.log(module, 'error', 'Failed to log in!');
		visuals.log(module, 'error', $error.message);
	});
	/*
	.then(async () =>{
		if (client.shard.ids[0] == 1) {
			const commandHelper = new CommandHelper({ path: `${process.cwd()}/commands`, client: client });
			await commandHelper.refreshAppCommands('696079746697527376');
			await commandHelper.refreshAppCommandPermissions('696079746697527376');
		}
	});
	*/