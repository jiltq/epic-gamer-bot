const Json = require('./Json.js');
const utility = require('./utility.js');

class Status {
	constructor(client, path) {
		this.client = client;
		this.path = path;
	}
	async cycle(client, path) {
		client.user.setStatus('dnd');
		setInterval(async function() {
			if (utility.random([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) == 1) {
				client.user.setPresence({ activities: [{ name: 'want to submit activities for egb? use the /addstatusmessage command!', type: 'PLAYING' }], status: 'dnd' });
			}
			else {
				const statuses = await Json.read(Json.formatPath('botActivities'));
				const activity = utility.random(statuses.activities);
				const e = await client.shard.broadcastEval(async (c, { userId }) => {
					const user = await c.users.fetch(userId);
					if (!user) return null;
					return user;
				}, { context: { userId: activity.addedBy } });
				const { tag } = e.filter(result => result != null)[0];

				client.user.setActivity(`${activity.message} - ${tag}`, { type: activity.type });
			}
		}, 1000 * 60);
	}
}
module.exports = Status;