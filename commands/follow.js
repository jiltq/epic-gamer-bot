const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('follow')
		.setDescription('follow a member on the server to receive updates about them')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('whether to add a following or to remove one')
				.addChoice('add', 'follow_add')
				.addChoice('remove', 'follow_remove')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('member')
				.setDescription('member to follow')
				.setRequired(true)),
	async execute(interaction) {
		const member = interaction.options.getUser('member');
		const action = interaction.options.getString('action');
		const personAddIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/person-add_icon.png`);
		const personRemoveIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/person-remove_icon.png`);

		if (member.id == interaction.user.id) {
			return interaction.reply({ content: 'you cannot follow yourself!', ephemeral: true });
		}
		if (member.bot) {
			return interaction.reply({ content: 'you cannot follow a bot!', ephemeral: true });
		}

		const json = new Json(`${process.cwd()}/JSON/userSettings.json`);
		const data = await json.read();

		if (!data.users[interaction.user.id]) {
			data.users[interaction.user.id] = data.template;
		}
		if (action == 'follow_add') {
			if (data.users[interaction.user.id].following.includes(member.id)) {
				const embed = new Discord.MessageEmbed()
					.setAuthor('member connections', interaction.user.avatarURL())
					.setTitle(`you are already following ${member.username}!`)
					.setColor('#ed4245');
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else {
				data.users[interaction.user.id].following.push(member.id);
				const embed = new Discord.MessageEmbed()
					.setAuthor('member connections', interaction.user.avatarURL())
					.setTitle(`you are now following ${member.username}`)
					.setColor('#57F287')
					.setThumbnail('attachment://person-add_icon.png');
				interaction.reply({ embeds: [embed], files: [personAddIcon], ephemeral: true });
			}
		}
		else if (action == 'follow_remove') {
			if (!data.users[interaction.user.id].following.includes(member.id)) {
				const embed = new Discord.MessageEmbed()
					.setAuthor('member connections', interaction.user.avatarURL())
					.setTitle(`you not currently following ${member.username}!`)
					.setColor('#ed4245');
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else {
				data.users[interaction.user.id].following = data.users[interaction.user.id].following.filter(follow => follow != member.id);
				const embed = new Discord.MessageEmbed()
					.setAuthor('member connections', interaction.user.avatarURL())
					.setTitle(`you are no longer following ${member.username}`)
					.setColor('#57F287')
					.setThumbnail('attachment://person-remove_icon.png');
				interaction.reply({ embeds: [embed], files: [personRemoveIcon], ephemeral: true });
			}
		}

		await json.write(data);
	},
};