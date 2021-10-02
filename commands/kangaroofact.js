const Discord = require('discord.js');
const embedHelper = require('../commandtemplates');

/*
	Fetch and send a random animal fact

	Created IDK by jiltq
*/

const animal = 'kangaroo';

module.exports = {
	name: `${animal}fact`,
	description: `a ${animal} fact!`,
	category: 'animals',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args, IPM) {
		const EmbedHelper = new embedHelper.AnimalFactEmbed(Discord, IPM);
		const embed = await EmbedHelper.create(animal);
		return message.channel.send(embed);
	},
	async internal(options) {
	},
};
