const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

module.exports = {
	name: 'speedtest',
	description: 'speed.. test',
	category: 'dev',
	async execute(message, args) {
		console.log(await execFile('.\\speedtest.exe'));
	},
};
