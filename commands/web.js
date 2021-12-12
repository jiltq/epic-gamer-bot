const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Worker } = require('worker_threads');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('web')
		.setDescription('browse the web'),
	async execute(interaction) {
		return;
		await interaction.deferReply();
		const worker = new Worker(`${process.cwd()}/webEmulator.js`, {
			workerData: {
				defaultURL: 'https://www.google.com',
			},
		});
		worker.postMessage({ method: 'startScreenshot' });
		const interface = new Discord.MessageEmbed()
			.setTitle('hi');
		const file = new Discord.MessageAttachment(`${process.cwd()}/webScreenshot.png`);

		const response = await interaction.editReply({ embeds: [interface] });

		worker.on('message', async data =>{
			if (data.status == 'screenshot') {
				console.log('woo!');
				const key = Math.random().toString();
				file.setFile(`${process.cwd()}/webScreenshot.png`);
				interface.setImage('attachment://webScreenshot.png');
				// await response.removeAttachments();
				await response.edit({ embeds: [interface], files: [file] });
				worker.postMessage({ method: 'gotoURL', url: 'https://discord.com' });
			}
		});
	},
};
