const fetch = require('node-fetch');

/**
 * Class for easily working with website APIs
 */
class Web {
	static async fetch(url, options) {
		return await fetch(url, options).then(response => response.json());
	}
	static createQuery(data) {
		return new URLSearchParams(data);
	}
}
module.exports = Web;