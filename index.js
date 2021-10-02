const { ShardingManager } = require('discord.js');
const { token } = require('../Epic Gamer Bot Main/config.json');
const visuals = require('./visuals.js');

const _file = './bot.js';
const _amount = 2;
const _delay = 5500;
const _timeout = 30000;

const manager = new ShardingManager(_file, { token: token });

let clientsLoggedIn = false;

module.exports = {
	name: 'Shard Manager',
	/**
	 * Evaluates a script on a shard
	 * @param {Function} script Script to evaluate
	 * @param {Number} shardId ID of shard
	 */
	async clientEval(script, shardId) {
		if (!clientsLoggedIn) return;
		return await manager.broadcastEval(script, { shard: shardId });
	},
};

manager.on('shardCreate', shard =>{
	visuals.log(module, 'norm', `Created shard ${shard.id}`);
});
manager.spawn({ amount: _amount, delay: _delay, timeout: _timeout })
	.then(() =>{
		visuals.log(module, 'success', 'Successfully spawned shards');
		clientsLoggedIn = true;
	})
	.catch(err =>{
		visuals.log(module, 'error', `Failed to spawn shards  ||  ${err.message}`);
		process.exit();
	});