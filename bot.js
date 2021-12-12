const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const visuals = require('./visuals.js');

module.exports = {
	name: 'Bot File',
};

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS];

const client = new Client({ intents: intents });
const Events = require('./eventHelper.js');
(new Events(__dirname + '/events/')).listen(client);

client.login(token)
	.catch($error=>{
		visuals.log(module, 'error', 'Failed to log in!');
		visuals.log(module, 'error', $error.message);
	});
