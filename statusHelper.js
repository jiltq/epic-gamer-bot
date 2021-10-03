const Json = require('./jsonHelper.js');

function status_update(client, statuses) {
	if (true) {
		// For random number function: https://www.w3schools.com/js/js_random.asp
		const newIndex = (Math.floor(Math.random() * (Object.keys(statuses.statuses).length - 1 + 1)) + 1) - 1;
		const newArray = Object.values(statuses.statuses)[newIndex];
		const newType = Object.keys(statuses.statuses)[newIndex];
		const newStatus = newArray[(Math.floor(Math.random() * (newArray.length - 1 + 1)) + 1) - 1];
		client.user.setPresence({ activities: [{ name: `${newStatus} | ?help`, type: newType }], status: 'dnd' });
	}
	else {
		client.user.setPresence({ activities: [{ name: `${statuses.featured_status.name} | ?help`, type: statuses.featured_status.type }], status: 'dnd' });
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
		}, 60000);
	}
}
module.exports = Status;