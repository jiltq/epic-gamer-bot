const { SlashCommandBuilder } = require('@discordjs/builders');

async function getUserFromMention(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return await guild.members.cache.get(mention);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban a member')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('member to ban')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('reason for ban')
				.setRequired(false))
		.addIntegerOption(option =>
			option.setName('days')
				.setDescription('ban duration')
				.setRequired(false)),
	async execute(interaction) {
		return;
		const member = interaction.options.getUser('member');
		member.ban({ days: interaction.options.getInteger('days'), reason: interaction.options.getString('reason') });
		interaction.reply({ content: 'banned member!' });
	},
};
