const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	name: 'duck',
	description: 'picture of duck',
	category: 'animals',
	async execute(message) {
		const response = JSON.parse(JSON.stringify(await (await fetch('https://random-d.uk/api/random')).json()));
		const exampleEmbed = new Discord.MessageEmbed()
			.setImage(response['url'])
			.setAuthor('quacky boi')
			.setFooter(response['message'].toLowerCase());

		return message.channel.send({embeds: [exampleEmbed]});
	},
	async internal() {
		const response = JSON.parse(JSON.stringify(await (await fetch('https://random-d.uk/api/random')).json()));
		return response['url'];
	},
};
