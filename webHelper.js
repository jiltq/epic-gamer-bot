const fetch = require('node-fetch');
const { spotifyId, spotifySecret, hereAccessKeyId, hereAccessKeySecret, hereClientId, hereClientSecret } = require('./config.json');
const querystring = require('querystring');
const authOptions = {
	'spotify': {
		url: 'https://accounts.spotify.com/api/token',
		options: {
			method: 'post',
			headers: {
				'Authorization': 'Basic ' + (new Buffer(spotifyId + ':' + spotifySecret).toString('base64')),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: querystring.stringify({
				grant_type: 'client_credentials',
			}),
		},
	},
	'here': {
		url: 'https://account.api.here.com/oauth2/token',
		options: {
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'OAuth',
				oauth_consumer_key: hereAccessKeyId,
				oauth_nonce: Date.now(),
				oauth_signature_method: 'HMAC-SHA256',
				oauth_timestamp: Date.now(),
				oauth_version: '1.0',
				client_id: hereClientId,
				client_secret: hereClientSecret,
			},
			body: querystring.stringify({
				grant_type: 'client_credentials',
			}),
		},
	},
};

class Web {
	constructor(joe) {
		this.joe = joe;
	}
	async fetch(url, options) {
		return await fetch(url, options).then(response => response.json());
	}
	async spotifyAuth(website) {
		const tokenBody = querystring.stringify({ grant_type: 'client_credentials' });
		const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
			method: 'post',
			body: tokenBody,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer(spotifyId + ':' + spotifySecret).toString('base64')),
			},
		});
		const { access_token } = JSON.parse(JSON.stringify(await (tokenResponse).json()));
		return access_token;
	}
	async hereAuth() {
		const tokenResponse = await fetch(authOptions.here.url, authOptions.here.options);
		return JSON.parse(JSON.stringify(await (tokenResponse).json()));
	}
}
module.exports = Web;