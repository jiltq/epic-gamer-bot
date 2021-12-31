const fs = require('fs');
const Discord = require('discord.js');
const logHelper = require('../logHelper.js');
const chalk = require('chalk');
const Archive = require('../archiveHelper.js');

const archiveChannel = '892599884107087892';

const commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${process.cwd()}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${process.cwd()}/commands/${file}`);
	if (command.data) {
		commands.set(command.data.name, command);
	}
}

const errorIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/error_icon.png`);

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const command = commands.get(interaction.commandName);

		const archive = new Archive('892599884107087892', 0, interaction.client);

		if (!command) return;
		logHelper.log(module.exports, 'default', `${chalk.hex(interaction.member.displayHexColor)(interaction.user.username)} executed ${interaction.toString()}`);
		archive.log('COMMAND', interaction);

		try {
			await command.execute(interaction);
		}
		catch (error) {
			logHelper.log(module.exports, 'error', `there was an unexpected error while executing command "${interaction.commandName}"`);
			logHelper.log(module.exports, 'error', error);
			const errorEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: 'command error', iconURL: 'attachment://error_icon.png' })
				.setTitle(error.message)
				.setFooter('try not doing that')
				.setColor('#ED4245');
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ embeds: [errorEmbed], files: [errorIcon], ephemeral: true });
			}
			else {
				await interaction.reply({ embeds: [errorEmbed], files: [errorIcon], ephemeral: true });
			}
		}
		if (interaction.guild.id == '696079746697527376') {
			// stats
			const gamerStat = await interaction.guild.channels.fetch('903076121539657758');
			const botStat = await interaction.guild.channels.fetch('903076402151174204');
			// const onlineGamersStat = await interaction.guild.channels.fetch('924798906120958072');

			gamerStat.setName(`gamers: ${interaction.guild.members.cache.filter(member => !member.user.bot).size}`);
			botStat.setName(`bots: ${interaction.guild.members.cache.filter(member => member.user.bot).size}`);
			// onlineGamersStat.setName(`gamers online: ${interaction.guild.members.cache.filter(member => (member.presence || { status: 'offline' }).status != 'offline').size}`);
		}
	},
};