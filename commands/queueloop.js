const { auto_update_cooldown } = require('../config.json');
const editor = require('../imageHelper');
const queuedir = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/queue.json';

async function check() {
	const queue = await IPM.return_json_data(queuedir);
	if (queue.queue.length > 0) {
		console.log('theres something there!!');
		const content = queue.queue[0];
		queue.queue.shift();
		await IPM.write_json_data(queuedir, queue);
		return await editor.edit(content);
	}
}

module.exports = {
	name: 'queueloop',
	internal: true,
	async execute(client) {
		if (client.shardID == 0) return;
		await check();
		setInterval(async function() {await check();}, auto_update_cooldown);
	},
};