const visuals = require('../visuals.js');

module.exports = {
	name: 'shardReconnecting',
	async execute(id) {
		visuals.log(module, 'warning', `Shard ${id} is attempting to reconnect or re-identify`);
	},
};