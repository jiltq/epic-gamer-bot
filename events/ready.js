const Status = require('../statusHelper.js');
const { CommandHelper } = require('../commandHelper.js');
const WebhookSignalManager = require('../webhookSignalManager.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const status = new Status(client, `${process.cwd()}/JSON/customStatuses.json`);
		await status.cycle(client);

		/*
		const webhookSignalManager = new WebhookSignalManager();
		await webhookSignalManager.createListener(client, 'egpointpurchase', async ({ json, client }) =>{
			const Store = require(`${process.cwd()}/storeHelper.js`);
			const store = new Store();
			const result = await store.buyItem(json.data.userId, json.data.item);
			console.log(result);
		});
		*/

		const commandHelper = new CommandHelper({ path: `${process.cwd()}/commands`, client: client });
		await commandHelper.refreshGlobalCommands();
		// await commandHelper.refreshGlobalCommandPermissions();
	},
};