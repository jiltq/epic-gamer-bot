const fetch = require('node-fetch');
const { spotifyId, spotifySecret } = require('./config.json');

const authOptions = {
	'spotify': {
		url: 'https://accounts.spotify.com/api/token',
		options: {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${(new Buffer(spotifyId + ':' + spotifySecret).toString('base64'))}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ grant_type: 'client_credentials' }),
		},
	},
};

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
	static async auth(websiteName) {
		const options = authOptions[websiteName];
		return await this.fetch(options.url, options.options);
	}
}
module.exports = Web;