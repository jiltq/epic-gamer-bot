const Status = require('../statusHelper.js');
const { CommandHelper } = require('../commandHelper.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const status = new Status(client, `${process.cwd()}/JSON/statuses.json`);
		await status.cycle();
		const commandHelper = new CommandHelper({ path: `${process.cwd()}/commands`, client: client });
		await commandHelper.refreshGlobalCommands();
		// await commandHelper.refreshGlobalCommandPermissions();
	},
};