/*
const { items } = require('../JSON/shop.json');

const udm = require('../userdatamanager.js');
const ecoManager = require('../submodules/economymanager.js');

module.exports = {
	name: 'buy',
	description: 'Buy an item',
	category: 'economy',
	async execute(message, args) {
		const item = args[0];
		const amount = args[1] || 1;
		const balance = await udm.readProperty(message.author.id, 'wealth');
		const inventory = await udm.readProperty(message.author.id, 'inventory');
		if (items[item] != null) {
			if (balance > items[item]) {
				const modItem = `${item} `;
				await udm.pushData(message.author.id, 'inventory', modItem.repeat(amount).split(' ').filter(entry => entry != ''));
				await ecoManager.subtractWealth(message.author.id, items[item]);
				return message.channel.send(`you now own ${item}\n\nyour balance is now: ${balance - items[item]}`);
			}
			else {
				return message.channel.send('you cant even afford that lol');
			}
		}
		else {
			return message.channel.send('that item doesnt even exist lmao');
		}
	},
};
*/
