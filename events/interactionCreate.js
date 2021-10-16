const fs = require('fs');
const Discord = require('discord.js');

const commands = new Discord.Collection();
const commandFiles = fs.readdirSync('C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`C:/Users/Ethan/OneDrive/Desktop/Epic Gamer Bot/commands/${file}`);
	if (command.data) {
		commands.set(command.data.name, command);
	}
}

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const command = commands.get(interaction.commandName);

		if (!command) return;

		try {
			interaction.deferReply();
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			const errorEmbed = new Discord.MessageEmbed()
				.setTitle('there was an error while executing this command :(')
				.setFooter('try not doing that')
				.setColor('#e88388');
			await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
		}
	},
};