const Status = require('../statusHelper.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		// client.user.setPresence({ activities: [{ name: 'starting up..', type: 'PLAYING' }], status: 'idle' });
		const status = new Status(client, 'C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/JSON/statuses.json');
		await status.cycle();
	},
};