const logHelper = require('../logHelper.js');

module.exports = {
	name: 'shardReconnecting',
	async execute(id) {
		logHelper.log(module.exports, 'warn', `Shard ${id} is attempting to reconnect or re-identify`);
	},
};