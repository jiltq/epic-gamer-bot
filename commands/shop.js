const shop = require('../JSON/shop.json');
const items = shop.items;

module.exports = {
	name: 'shop',
	description: 'Lists the available items',
	async execute(message, args) {
		return;
		message.channel.send(Object.keys(items));
	},
};
