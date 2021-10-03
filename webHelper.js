const fetch = require('node-fetch');

class Web {
	constructor(joe) {
		this.joe = joe;
	}
	async fetch(url, options) {
		return JSON.parse(JSON.stringify(await (await fetch(url, options)).json()));
	}
}
module.exports = Web;