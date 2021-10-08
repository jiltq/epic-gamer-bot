const visuals = require('../visuals.js');

module.exports = {
	name: 'shardError',
	async execute(error, id) {
		visuals.log(module, 'error', `Shard ${id} encountered a connection error  ||  ${error.message}`);
	},
};