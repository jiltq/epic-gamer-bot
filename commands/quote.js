const Discord = require('discord.js');
const channelId = '810280215497539625';
const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require('../utility.js');

module.exports = {
	data: {
		name: 'quote',
		toJSON() {
			return { name: 'quote', type: 3 };
		},
	},
	async execute(interaction) {
		const channel = await interaction.guild.channels.fetch(interaction.channelId);
		const messages = await channel.messages.fetch({ limit: 10, around: interaction.targetId });
		messages.sort(function(a, b) {
			return a.id - b.id;
		});
		const done = [];
		const tempEmojis = [];
		const authors = utility.removeDupes(messages.map(message => message.author));
		for (const author of authors) {
			const emoji = await interaction.guild.emojis.create(author.avatarURL({ size: 128 }), `temp_${author.username.replace(/ /g, '_')}`);
			done.push(author.id);
			tempEmojis.push(emoji);
		}
		const embed = new Discord.MessageEmbed()
			.setDescription(`${messages.map(message => `${tempEmojis.find(emoji => emoji.name == `temp_${message.author.username.replace(/ /g, '_')}`).toString()} **${message.author.username}** \`${(new Date(message.createdTimestamp)).toLocaleTimeString('en-US')}\`\n${message.content}`).join('\n\n')}`);
		await interaction.reply({ embeds: [embed] });
		for (const emoji of tempEmojis) {
			await emoji.delete();
		}
	},
};
