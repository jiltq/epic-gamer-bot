const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');
const BotEventHelper = require('./BotEventHelper.js');

const manager = new ShardingManager('./shard.js', { token });

!async function() {
	await BotEventHelper.listen({ emitter: manager, path: __dirname + '/events/' });
	await manager.spawn({ amount: 2 });
}();