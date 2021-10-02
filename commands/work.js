/*
const udm = require('../userdatamanager.js');
const ecoManager = require('../submodules/economymanager.js');

const jobsPay = {
	'Epic Gamer Bot Developer': 1e+100,
	'Cashier': 10,
	'Chef': 23,
	'YouTuber': 25,
	'Programmer': 31,
};

module.exports = {
	name: 'work',
	description: 'Work for money!',
	args: false,
	category: 'economy',
	async execute(message, args) {
		const job = await udm.readProperty(message.author.id, 'job');
		const newJob = args[0] || 'None';
		if (newJob != 'None') {
			if (!jobsPay[newJob]) return message.channel.send('it doesnt seem like that job even exists lol');
			await udm.writeProperty(message.author.id, 'job', newJob);
			return message.channel.send(`ok now you're working as a ${newJob}`);
		}
		else {
			if (job == 'None') return message.channel.send('lol you dont even have a job what are you doing');
			if (!jobsPay[job]) return message.channel.send('it doesnt seem like that job even exists, how do you have it');
			await ecoManager.addWealth(message.author.id, jobsPay[job]);
			return message.channel.send(`You received $${jobsPay[job]}!`);
		}
	},
};
*/
