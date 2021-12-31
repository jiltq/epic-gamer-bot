const { isMainThread, workerData, parentPort } = require('worker_threads');
const express = require('express');
const fetch = require('node-fetch');
const { clientId, clientSecret, oAuth2Port } = require('./config.json');

const webpage = 'oauth2Page.html';
const { scopes } = workerData;

async function fetch2(url, options) {
	const raw = await fetch(url, options);
	return await raw.json();
}

async function doTheDew() {
	const app = express();

	app.get('/', async ({ query }, response) => {
		const { code } = query;

		console.log(code);

		if (code) {
			try {
				const oauthData = await fetch2('https://discord.com/api/oauth2/token', {
					method: 'POST',
					body: new URLSearchParams({
						client_id: clientId,
						client_secret: clientSecret,
						code,
						grant_type: 'authorization_code',
						redirect_uri: `http://localhost:${oAuth2Port}`,
						scope: 'identify',
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				});

				console.log(oauthData);

				const userResult = await fetch2('https://discord.com/api/users/@me', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});

				const connections = await fetch2('https://discord.com/api/users/@me/connections', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				const guilds = await fetch2('https://discord.com/api/users/@me/guilds', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				console.log(guilds);
				parentPort.postMessage({ status: 'data get', data: { user: userResult, connections: connections } });
			}
			catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
				console.error(error);
			}
		}

		return response.sendFile(webpage, { root: '.' });
	});

	app.listen(oAuth2Port, () =>{
		parentPort.postMessage({ status: 'server online' });
		console.log(`App listening at http://localhost:${oAuth2Port}`);
	});
}

if (!isMainThread) {
	parentPort.postMessage({ status: 'start' });
	console.log('oauth2 server init');

	doTheDew();
}