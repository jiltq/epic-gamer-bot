const fetch = require('node-fetch');

class Web {
	constructor(joe) {
		this.joe = joe;
	}
	async fetch(url, options) {
		return await fetch(url, options).then(response => response.json());
	}
}
module.exports = Web;