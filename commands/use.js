/*
const udm = require('../userdatamanager.js');

module.exports = {
	name: 'use',
	description: 'Use an item in your inventory',
	args: true,
	category: 'economy',
	async execute(message, args) {
		const item = args[0];
		const inventory = await udm.readProperty(message.author.id, 'inventory');
		if (!inventory.includes(item)) return message.channel.send('dude you dont even own that');

		switch (item) {
		case 'test':
			message.channel.send('you used `test`, but nothing happened');
			break;
		default:
			message.channel.send('you can\'t use that item 🤔');
			break;
		}
	},
};
*/
