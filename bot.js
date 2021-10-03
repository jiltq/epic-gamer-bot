const Discord = require('discord.js');
const config = require('./config.json');
const visuals = require('./visuals.js');

const _intents = [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES];

module.exports = {
	name: 'Bot File',
};

const client = new Discord.Client({ intents: _intents, partials: ['GUILD_MEMBER', 'USER', 'MESSAGE', 'CHANNEL', 'REACTION'] });
const Events = require('./eventHelper.js');
const events = new Events(__dirname + '/events/');
events.listen(client);
const Status = require('./statusHelper.js');

client.on('shardDisconnect', ($event, $id) =>{
	visuals.log(module, 'error', `Shard ${$id} disconnected`);
	visuals.log(module, 'error', `Code ${$event.code} -- ${$event.reason}`);
});
client.on('shardError', ($error, $shardId) =>{
	visuals.log(module, 'error', `Shard ${$shardId} encountered a connection error  ||  ${$error.message}`);
});
client.on('shardReady', $id =>{
	visuals.log(module, 'success', `Shard ${$id} is now ready`);
});
client.once('shardReady', async () =>{
	const status = new Status(client, 'C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/statuses.json');
	await status.cycle();
});
client.on('shardReconnecting', $id =>{
	visuals.log(module, 'warning', `Shard ${$id} is attempting to reconnect or re-identify`);
});
client.on('guildMemberAdd', (member) =>{
	// IPM.execute_internal_command('verification', { 'client': client, 'member': member });
});
client.on('guildMemberRemove', async member =>{
	console.log(`oh no ${member.displayName} left ${member.guild.name} :((`);
});
client.login(config.token)
	.catch($error=>{
		visuals.log(module, 'error', 'Failed to log in!');
		visuals.log(module, 'error', $error.message);
	});
