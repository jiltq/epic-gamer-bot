const Status = require('../statusHelper.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const status = new Status(client, `${process.cwd()}/JSON/statuses.json`);
		await status.cycle();
	},
};