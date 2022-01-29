const logHelper = require('../logHelper.js');

module.exports = {
	name: 'shardCreate',
	async execute(shard) {
		logHelper.log(module.exports, 'default', `Created shard ${shard.id}`);
	},
};