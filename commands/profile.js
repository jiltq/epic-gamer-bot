const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Json = require('../jsonHelper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('view a member\'s profile profile')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('member who\'s profile to view; if left blank, views your own')
				.setRequired(false)),
	async execute(interaction) {
		const json = new Json(`${process.cwd()}/JSON/userConnections.json`);
		const data = await json.read();
		const user = interaction.options.getUser('member') || interaction.user;

		let userData = data.users[user.id];

		if (!userData) {
			userData = data.userDataTemplate;
		}

		const followingMembers = [];

		for (let i = 0;i < userData.following.length;i++) {
			followingMembers[i] = await interaction.guild.members.fetch(userData.following[i]);
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor('member connections', user.avatarURL())
			.setTitle(`${interaction.user.id == user.id ? 'your' : `${user.username}'s`} profile`)
			.setColor('#2f3136')
			.addField('following', userData.followingPrivate && interaction.user.id != user.id ? 'this member has set their followings to private' : followingMembers.length > 0 ? followingMembers.map(follow => `**${follow.user.username}**#${follow.user.discriminator}`).join('\n') : 'none')
			.addField('accounts', userData.accountsPrivate && interaction.user.id != user.id ? 'this member has set their accounts to private' : Object.keys(userData.accounts).length > 0 ? Object.entries(userData.accounts).map(account => `**${account[0]}**: ${account[1].username}`).join('\n') : 'none')
			.setFooter('member connections are used to keep you informed on what matters most to you');

		interaction.reply({ embeds: [embed], ephemeral: true });

		data.users[user.id] = userData;
		await json.write(data);
	},
};