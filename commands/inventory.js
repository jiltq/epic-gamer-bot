/*
const udm = require('../userdatamanager.js');
const Discord = require('discord.js');

module.exports = {
	name: 'inventory',
	description: 'View your inventory',
	category: 'economy',
	async execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Inventory`);
		const inventory = await udm.readProperty(message.author.id, 'inventory');
		const uniqueArray = [];
		const uniqueCount = {};
		inventory.forEach(item =>{
			if (!uniqueArray.includes(item)) uniqueArray.push(item);
		});
		uniqueArray.forEach(unique =>{
			uniqueCount[unique] = 0;
			for(let i = 0; i < inventory.length; ++i) {
				if(inventory[i] == unique) {uniqueCount[unique]++;}
			}
			embed.addField(unique, `x${uniqueCount[unique]}`);
		});
		message.channel.send(embed);
	},
};
*/
