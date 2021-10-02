const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	name: 'whereistheiss',
	description: 'returns the coordinates of the international space station!! wow1!',
	category: 'fun',
	async execute(message) {
		const position = JSON.parse(JSON.stringify(await (await fetch('http://api.open-notify.org/iss-now.json')).json()))['iss_position'];
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#a88f7e')
			.setTitle(`${position['latitude']},${position['longitude']}`);
		return message.channel.send(exampleEmbed);
	},
	async internal() {
		return JSON.parse(JSON.stringify(await (await fetch('http://api.open-notify.org/iss-now.json')).json()))['iss_position'];
	},
};
