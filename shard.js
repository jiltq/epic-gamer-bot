const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const BotEventHelper = require('./BotEventHelper.js');

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS];
const client = new Client({ intents });

!async function() {
	await BotEventHelper.listen({ emitter: client, path: __dirname + '/events/' });
	await client.login(token);
}();

process.on('uncaughtException', error =>{
	console.log(error);
});