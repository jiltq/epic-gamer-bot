const Discord = require('discord.js');
const config = require('./config.json');
const visuals = require('./visuals.js');

const _intents = [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES];

module.exports = {
	name: 'Bot File',
};

const client = new Discord.Client({ intents: _intents, partials: ['GUILD_MEMBER', 'USER', 'MESSAGE', 'CHANNEL', 'REACTION'] });
const Events = require('./eventHelper.js');
(new Events(__dirname + '/events/')).listen(client);

client.login(config.token)
	.catch($error=>{
		visuals.log(module, 'error', 'Failed to log in!');
		visuals.log(module, 'error', $error.message);
	});
