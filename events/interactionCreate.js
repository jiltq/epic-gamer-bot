const fs = require('fs');
const Discord = require('discord.js');
const logHelper = require('../logHelper.js');
const chalk = require('chalk');
const Archive = require('../archiveHelper.js');
const Json = require('../jsonHelper.js');
const utility = require('../utility.js');

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
			console.log(error);
			const errorEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: 'command error', iconURL: 'attachment://error_icon.png' })
				.setTitle(error.toString())
				.setFooter('an error report has been sent to jiltq')
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
		const hubMembers = await interaction.client.shard.broadcastEval(async (c, context) => {
			const hub = await c.guilds.fetch('926307504533680169');
			return hub.members.cache.map(member => member.user.id);
		}, { shard: 0, context: { } });
		const advertise = utility.random([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) == 1;
		if (advertise) {
			const nonHubMembers = interaction.guild.members.cache.filter(member => !hubMembers.includes(member.user.id) && !member.user.bot).map(member => member.user.id);
			const target = utility.random(nonHubMembers);
			const targetMember = await interaction.guild.members.fetch(target);
			console.log(targetMember);
			const hubEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: 'eg-verse', iconURL: 'https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png' })
				.setColor('#2f3136')
				.setTitle('click here to join the eg-verse hub and start engaging in the eg-verse! use /egverse info for more information')
				.setURL('https://discord.gg/dpm95JnQfu')
				.setThumbnail('https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png')
				.setFooter({ text: 'this is an automated message and will ocassionally repeat until you join the eg-verse hub' });
			await targetMember.send({ embeds: [hubEmbed] });
		}
	},
};