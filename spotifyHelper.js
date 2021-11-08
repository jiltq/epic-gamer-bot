const fetch = require('node-fetch');
const { spotifyId, spotifySecret } = require('./config.json');
const querystring = require('querystring');

class Spotify {
	constructor(joe) {
		this.joe = joe;
	}
	async fetch(url, options) {
		if (!options.headers) options.headers = {};
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
		options.headers['Authorization'] = `Bearer ${access_token}`;
		options.headers['Content-Type'] = 'application/json';

		const response = await fetch(url, options);
		return JSON.parse(JSON.stringify(await (response).json()));
	}
}
module.exports = Spotify;