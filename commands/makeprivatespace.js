const Discord = require('discord.js');

async function getUserFromMention(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		const { client } = require(require.main.filename);
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return await guild.members.cache.get(mention);
	}
}

module.exports = {
	name: 'makeprivatespace',
	description: 'make a new private space for you and anyone you want!',
	async execute(message, args) {
		const newArgs = [];
		args.forEach(async mention =>{
			const member = getUserFromMention(mention, message.guild);
			newArgs.push(member);
		});
		const members = [ message.member, ...newArgs ];
		const guild = message.guild;
		const category = await guild.channels.create(`${message.member.displayName}'s Private Space`, {
			type: 'category',
			overwritePermissions: [
				{
					id: '696079746697527376',
					deny: ['VIEW_CHANNEL'],
				},
			],
		});
		category.updateOverwrite('696079746697527376', {
			VIEW_CHANNEL: false,
		});
		category.updateOverwrite(message.member.id, {
			VIEW_CHANNEL: true,
		});
		members.forEach(async member =>{
			category.updateOverwrite(member, {
				VIEW_CHANNEL: true,
			});
			/*
			category.overwritePermissions([
				{
					id: member.id,
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'SPEAK', 'USE_VAD', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS', 'STREAM', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
				},
				{
					id: '696079746697527376',
					deny: ['VIEW_CHANNEL'],
				},
			], 'E');
			*/
		});
		await guild.channels.create('Voice Channel', {
			type: 'voice',
			parent: category,
		});
		const text = await guild.channels.create('text-channel', {
			type: 'text',
			parent: category,
		});
		const responseEmbed = new Discord.MessageEmbed()
			.setTitle(`Successfully created __${category.name}!__`)
			.setDescription(`You can find it here: ${text.toString()}`)
			.addField('Members allowed access', members.map(member => member.displayName).join('\n'));
		message.channel.send(responseEmbed);
	},
};
