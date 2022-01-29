const { SlashCommandBuilder } = require('@discordjs/builders');
const Json = require('../Json.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addstatusmessage')
		.setDescription('give egb something to do..')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('type of status message')
				.setRequired(true)
				.addChoice('🎮 playing', 'PLAYING')
				.addChoice('🎬 watching', 'WATCHING')
				.addChoice('🎶 listening to', 'LISTENING')
				.addChoice('⚔️ competing in', 'COMPETING')
				.addChoice('🖥️ streaming', 'STREAMING'))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('the status message')
				.setRequired(true)),
	async execute(interaction) {
		const type = interaction.options.getString('type');const message = interaction.options.getString('message');
		const data = await Json.read(Json.formatPath('botActivities'));
		data.activities.push({ message, type, addedBy: interaction.user.id });
		await Json.write(Json.formatPath('botActivities'), data);
		await interaction.reply({ content: '**successfully added your status message!**' });
	},
};
