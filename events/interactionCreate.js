const fs = require('fs');
const Discord = require('discord.js');
const logHelper = require('../logHelper.js');
const chalk = require('chalk');
const Archive = require('../archiveHelper.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility.js');
const { embedColors } = require('../Decor.js');

const Store = require('../storeHelper.js');

const { CommandManager } = require('../commandManagers.js');

const archiveChannel = '892599884107087892';

const commandManager = new CommandManager();
const commands = commandManager.registerCommandModules(`${process.cwd()}/commands`);

const errorIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/error_icon.png`);

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isMessageContextMenu()) return;
		const command = commands.get(interaction.commandName);

		const archive = new Archive('892599884107087892', 0, interaction.client);

		if (!command) return;
		logHelper.log(module.exports, 'default', `${chalk.hex(interaction.member.displayHexColor)(interaction.user.username)} executed ${interaction.toString()}`);
		archive.log('COMMAND', interaction);

		const store = new Store();
		await store.addPointsToUser(interaction.user.id, 4);

		try {
			await commandManager.executeCommand(command, interaction);
		}
		catch (error) {
			logHelper.log(module.exports, 'error', `there was an unexpected error while executing command "${interaction.commandName}"`);
			logHelper.log(module.exports, 'error', error.toString());
			const errorEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: 'command error', iconURL: 'attachment://error_icon.png' })
				.setTitle(error.toString())
				.setFooter('an error report has been sent to jiltq')
				.setColor(embedColors.error);
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