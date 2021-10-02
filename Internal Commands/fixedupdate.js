const { fixedUpdateInterval } = require('../config.json');

let options;
async function fixedUpdate() {
	const client = options.client;const IPM = options.IPM;
	console.log(client.ws.ping);
}
module.exports = {
	async fixedUpdateTrigger(options_) {
    return;
		options = options_;
		setInterval(function() {fixedUpdate();}, fixedUpdateInterval);
	},
};
