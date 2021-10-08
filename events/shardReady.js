const visuals = require('../visuals.js');

module.exports = {
	name: 'shardReady',
	async execute(id) {
		visuals.log(module, 'success', `Shard ${id} is now ready`);
	},
};