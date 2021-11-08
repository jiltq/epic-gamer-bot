const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoclicker')
		.setDescription('download the epic gamer autoclicker'),
	async execute(interaction) {
		const thumbnail = new Discord.MessageAttachment('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/assets/mouse_icon.png');
		const embed = new Discord.MessageEmbed()
			.setTitle('epic gamer autoclicker')
			.setThumbnail('attachment://mouse_icon.png')
			.setDescription('the official autoclicker for epic gamers, created by jiltq')
			.addField('features', '• lightweight & fast executable\n• adjustable CPS\n• double-click support\n• and most importantly, a dark mode')
			.setFooter('click the download link above to start autoclicking');
		const download = new Discord.MessageAttachment('C:/Users/Ethan/source/repos/editor/Release/epic gamers autoclicker.exe');
		await interaction.reply({ embeds: [embed], files: [thumbnail, download], ephemeral: true });
	},
};
