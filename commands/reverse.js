const Discord = require('discord.js');
const { Worker } = require('worker_threads');
const visuals = require('../visuals.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reverse')
		.setDescription('reverse a gif')
		.addStringOption(option =>
			option.setName('gif')
				.setDescription('gif to reverse')
				.setRequired(true)),
	async execute(interaction) {
		const worker = new Worker(`${process.cwd()}/imageHelper3.js`, {
			workerData: {
				method: 'reverse',
				link: interaction.options.getString('gif'),
			},
		});
		worker.on('message', async message =>{
			console.log(message);
		});
	},
};
