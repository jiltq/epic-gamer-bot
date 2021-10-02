module.exports = {
	async add2Queue(items) {
		const IPM = require('./IPM.js');
		const queue = await IPM.return_json_data(__dirname + '/queue.json');
		queue.queue = [
			...queue.queue,
			...items,
		];
		return await IPM.write_json_data(__dirname + '/queue.json', queue);
	},
};