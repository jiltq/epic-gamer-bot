module.exports = {
	name: 'startup',
	internal: true,
	async execute() {
		const clientmodule = require('../databases/client.js');
		return clientmodule.get();
	},
};
