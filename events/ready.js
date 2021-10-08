const Status = require('../statusHelper.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const status = new Status(client, 'C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/JSON/statuses.json');
		await status.cycle();
	},
};