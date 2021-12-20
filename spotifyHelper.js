const fetch = require('node-fetch');
const querystring = require('querystring');
const utility = require('./utility.js');
const web = new (require('./webHelper.js'))();

class Spotify {
	constructor(joe) {
		this.joe = joe;
	}
	async fetch(url, options = {}) {
		if (!options.headers) options.headers = {};
		const token = await web.spotifyAuth();

		options.headers['Authorization'] = `Bearer ${token}`;
		options.headers['Content-Type'] = 'application/json';

		const response = await fetch(url, options);
		return JSON.parse(JSON.stringify(await (response).json()));
	}
	async getSuggestions(id) {
		const Json = new (require('./jsonHelper.js'))(`${process.cwd()}/JSON/songSuggestions.json`);
		const data = await Json.read();
		const userData = data.users[id];
		if (!userData) {
			return { tracks: [] };
		}
		const suggestQuery = querystring.stringify({
			limit: 100,
			seed_artists: userData.artists.slice(-5),
			seed_tracks: userData.tracks.slice(-5),
		});
		const suggestions = await this.fetch(`https://api.spotify.com/v1/recommendations?${suggestQuery}`, {});
		return suggestions;
	}
}
module.exports = Spotify;