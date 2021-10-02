const statuses = require('../statuses.json');

// Miliseconds before Epic Gamer Bot updates its status - 300000 by default
const { auto_update_cooldown } = require('../config.json');

const logUpdates = true;

let isStatusFeatured = false;

/*
	Automatic status updater

	Applies a random status if one is not featured
*/

function status_update(client) {
	if (!isStatusFeatured) {
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
	setTimeout(function() {
		return status_update(client);
	}, Math.abs(client.ws.ping / 60) * 60000);
}

module.exports = {
	name: 'UpdateStatus',
	async execute(client) {
		if (client.shardID == null) return;
		if (!client.user.presence.activities.length && statuses.featured_status.name !== null && statuses.featured_status.type !== null) {
			client.user.setPresence({ activity: { name: `${statuses.featured_status.name} | ?help`, type: statuses.featured_status.type }, status: 'dnd' });
			isStatusFeatured = true;
		}
		status_update(client);
	},
};
