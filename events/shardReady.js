const logHelper = require('../logHelper.js');

module.exports = {
	name: 'shardReady',
	async execute(id) {
		logHelper.log(module.exports, 'success', `Shard ${id} is now ready`);
	},
};