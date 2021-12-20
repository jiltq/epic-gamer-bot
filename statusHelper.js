const Json = require('./jsonHelper.js');
const utility = require('./utility.js');

async function status_update(client, statuses) {
	if (!statuses.featured.name) {
		const userDataJson = new Json(`${process.cwd()}/JSON/userData.json`);
		const userData = await userDataJson.read();

		let games = [];

		const gamesRaw = Object.values(userData.users).filter(user => user.games.length > 0).map(user => user.games.map(game => game.name));
		for (let i = 0;i < gamesRaw.length;i++) {
			const group = gamesRaw[i];
			for (let i2 = 0;i2 < group.length;i2++) {
				if (!games.includes(group[i2])) {
					games.push(group[i2]);
				}
			}
		}
		games = utility.removeDupes(games);

		/*

		const type = utility.random(Object.keys(statuses.activities));
		const activity = utility.random(statuses.activities[type]);
		client.user.setPresence({ activities: [{ name: activity, type: type }], status: 'dnd' });
		*/
		client.user.setPresence({ activities: [{ name: utility.random(games), type: 'PLAYING' }], status: 'dnd' });
	}
	else {
		client.user.setPresence({ activities: [{ name: statuses.featured.name, type: statuses.featured.type }], status: 'dnd' });
	}
}

class Status {
	constructor(client, path) {
		this.client = client;
		this.path = path;
	}
	async cycle() {
		const json = new Json(this.path);
		const statuses = await json.read();
		const client = this.client;
		await status_update(client, statuses);
		setInterval(async function() {
			await status_update(client, statuses);
		}, 1000 * 60);
	}
}
module.exports = Status;