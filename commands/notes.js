const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');
const notesJSON = new Json('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/JSON/notes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notes')
		.setDescription('keep track of things')
		.addStringOption(option =>
			option
				.setName('action')
				.setDescription('what to do')
				.addChoice('view', 'act_view')
				.addChoice('edit', 'act_edit')
				.addChoice('add', 'act_add')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('note')
				.setDescription('note to view')
				.setRequired(true),
		),
	async execute(interaction) {
		const data = await notesJSON.read();
		const embed = new Discord.MessageEmbed()
			.setTitle('your notes');
		if (data.users[interaction.user.id]) {
			for (const note of data.users[interaction.user.id]) {
				embed.addField(note.title, note.description);
			}
		}
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
