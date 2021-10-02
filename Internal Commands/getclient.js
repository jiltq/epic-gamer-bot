module.exports = {
	name: 'startup',
	async internal() {
		const clientmodule = require('../databases/client.js');
		return clientmodule.get();
	},
};
