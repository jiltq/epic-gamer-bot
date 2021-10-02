const Discord = require('discord.js');
const embedHelper = require('../commandtemplates');

/*
	Fetch and send a random picture of an animal

	Created IDK by jiltq
*/

const animal = 'red_panda';
const caption = 'red boi';

module.exports = {
	name: animal,
	description: `picture of ${animal}`,
	category: 'animals',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args, IPM) {
		const EmbedHelper = new embedHelper.AnimalPicEmbed(Discord, IPM);
		const embed = await EmbedHelper.create(animal, caption);
		return message.channel.send(embed);
	},
	async internal(options) {
		const response = await options.IPM.fetch(`https://some-random-api.ml/img/${animal}`);
		return response.link;
	},
};
