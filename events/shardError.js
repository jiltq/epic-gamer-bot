const logHelper = require('../logHelper.js');

module.exports = {
	name: 'shardError',
	async execute(error, id) {
		logHelper.log(module.exports, 'error', `Shard ${id} encountered a connection error  ||  ${error.message}`);
	},
};