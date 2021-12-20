const fs = require('fs');
const Discord = require('discord.js');
const logHelper = require('../logHelper.js');

const archiveChannel = '892599884107087892';

const commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${process.cwd()}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${process.cwd()}/commands/${file}`);
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
		logHelper.log(module.exports, 'default', `User "${interaction.user.username}" executed command "${interaction.commandName}"`);

		/*
		console.log(interaction);
		await interaction.client.shard.broadcastEval(async (c, { $interaction, $test }) => {
			console.log($interaction);
			console.log($test);
		}, { shard: 0, context: {
			$interaction: interaction,
			$test: { ...interaction },
		} });
		*/

		try {
			await command.execute(interaction);
		}
		catch (error) {
			logHelper.log(module.exports, 'error', `there was an unexpected error while executing command "${interaction.commandName}"`);
			logHelper.log(module.exports, 'error', error);
			const errorEmbed = new Discord.MessageEmbed()
				.setTitle('there was an error while executing this command :(')
				.setFooter('try not doing that')
				.setColor('#e88388');
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
			}
			else {
				await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			}
		}
		if (interaction.guild.id == '696079746697527376') {
			// stats
			const gamerStat = await interaction.guild.channels.fetch('903076121539657758');
			const botStat = await interaction.guild.channels.fetch('903076402151174204');

			gamerStat.setName(`gamers: ${interaction.guild.members.cache.filter(member => !member.user.bot).size}`);
			botStat.setName(`bots: ${interaction.guild.members.cache.filter(member => member.user.bot).size}`);
		}
	},
};