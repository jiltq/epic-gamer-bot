const fetch = require('node-fetch');
const Discord = require('discord.js');
const { token } = require('../config');

module.exports = {
	name: 'nethertooverworld',
	description: 'convert nether coordinates to overworld coordinates',
	category: 'fun',
	usage: '[x,z]',
	slash_command_options: [ { 'name':'x', 'description':'x coordinate', 'type':4, 'required':true }, { 'name':'z', 'description':'z coordinate', 'type':4, 'required':true } ],
	async execute(message, args) {
		const apiEndpoint = 'https://discord.com/api/v8/applications/700455539557269575/guilds/696079746697527376/commands';
		const command = { 'name': module.exports.name, 'description': module.exports.description, 'options': module.exports.slash_command_options };
		const response = await fetch(apiEndpoint, {
			method: 'post',
			body: JSON.stringify(command),
			headers: {
				'Authorization': 'Bot ' + token,
				'Content-Type':'application/json',
			},
		});
		const json = await response.json();

		console.log(json);

		// ------------
		if (!args.length) return message.reply('Please provide valid coordinates!');
		if (args.length == 1) return message.reply('Please provide 2 coordinates!');
		if (args.length > 2) return message.reply('Please provide 2 coordinates!');
		if (args.filter(arg => isNaN(arg)).length) return message.reply('Please provide valid coordinates!');
		const netherX = args[0];const netherZ = args[1];
		const overworldX = netherX * 8;const overworldZ = netherZ * 8;
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Nether: ${netherX}, ~, ${netherZ}`)
			.setTitle(`Overworld: ${overworldX}, ~, ${overworldZ}`);
		message.channel.send(embed);
	},
};
