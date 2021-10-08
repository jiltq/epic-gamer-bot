const visuals = require('../visuals.js');

module.exports = {
	name: 'shardDisconnect',
	async execute(event, id) {
		visuals.log(module, 'error', `Shard ${id} disconnected`);
		visuals.log(module, 'error', `Code ${event.code} -- ${event.reason}`);
	},
};