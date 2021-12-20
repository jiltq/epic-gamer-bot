const { ShardingManager } = require('discord.js');
const { token, username } = require('./config.json');
const logHelper = require('./logHelper.js');
const { Worker } = require('worker_threads');

const _file = './bot.js';
const _amount = 2;
const _delay = 5500;
const _timeout = 30000;

module.exports = {
	name: 'Main File',
};
logHelper.log(module.exports, 'default', `${username} initialized..`);

const slashCommandWorker = new Worker(`${process.cwd()}/slashCommandManager.js`, {
	workerData: {
		method: 'refresh',
	},
});
slashCommandWorker.on('message', async message =>{
	switch(message.status) {
	case 'start':
		logHelper.log(module.exports, 'default', 'Refreshing application (/) commands..');
		break;
	case 'success':
		logHelper.log(module.exports, 'success', 'Successfully refreshed application (/) commands');
		break;
	case 'error':
		logHelper.log(module.exports, 'error', 'An unexpected error occured while refreshing application (/) commands');
		logHelper.log(module.exports, 'error', message.error);
		break;
	}
});

const manager = new ShardingManager(_file, { token: token });

manager.on('shardCreate', shard =>{
	logHelper.log(module.exports, 'default', `Created shard ${shard.id}`);
});
manager.spawn({ amount: _amount, delay: _delay, timeout: _timeout })
	.then(() =>{
		logHelper.log(module.exports, 'success', 'Successfully spawned shards');
	})
	.catch(err =>{
		logHelper.log(module.exports, 'error', 'Failed to spawn shards');
		logHelper.log(module.exports, 'error', err);
		process.exit();
	});