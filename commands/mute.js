const Discord = require('discord.js');

function getUserFromMention(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		const { client } = require(require.main.filename);
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return guild.members.cache.get(mention);
	}
}

module.exports = {
	name: 'mute',
	description: 'mute a user from all text channels',
	category: 'moderation',
	creator: { 'name': 'jiltq' },
	slash_command_options: [],
	async execute(message, args, IPM) {
		if (!args.length) return message.channel.send('please provide a mention to the user you want to mute!');
		if (!getUserFromMention(args[0], message.guild)) return message.channel.send('not a valid user!');
		message.channel.overwritePermissions([
			{
				id: getUserFromMention(args[0], message.guild),
				deny: ['SEND_MESSAGES'],
			},
		], 'Needed to change permissions');
	},
};
