const Json = require('./jsonHelper.js');
const utility = require('./utility.js');

function status_update(client, statuses) {
	if (!statuses.featured.name) {
		const type = utility.random(Object.keys(statuses.activities));
		const activity = utility.random(statuses.activities[type]);
		client.user.setPresence({ activities: [{ name: `${activity} | ?help`, type: type }], status: 'dnd' });
	}
	else {
		client.user.setPresence({ activities: [{ name: `${statuses.featured.name} | ?help`, type: statuses.featured.type }], status: 'dnd' });
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
		status_update(client, statuses);
		setInterval(function() {
			status_update(client, statuses);
		}, 1000 * 60);
	}
}
module.exports = Status;