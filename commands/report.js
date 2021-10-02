async function getMember(mention, guild) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return await guild.members.cache.get(mention);
	}
}
const filterPath = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/filterData.json';
const numOfMessages = 50;

module.exports = {
	name: 'report',
	description: 'Report a user for misconduct',
	category: 'moderation',
	usage: '[user to report]',
	args: true,
	async execute(message, args, IPM) {
		const member = await getMember(args[0], message.guild);
		if (!member) {
			return message.reply({ content: 'Please provide a valid user!' });
		}
		const data = await IPM.readJSON(filterPath);
		const badMessages = ((await message.channel.messages.fetch({ limit: numOfMessages })).filter($message => $message.author.id == member.id && !$message.author.bot && $message.content != '')).map($message => $message.content);
		const goodMessages = ((await message.channel.messages.fetch({ limit: numOfMessages })).filter($message => $message.author.id != member.id && !$message.author.bot && $message.content != '' && !data.badMembers.includes($message.author.id))).map($message => $message.content);
		const newData = [];
		badMessages.forEach(badMessage =>{
			newData.push({ input: badMessage, output: 'bad' });
		});
		goodMessages.forEach(goodMessage =>{
			newData.push({ input: goodMessage, output: 'good' });
		});
		return await IPM.writeJSON(filterPath, {
			messages: [
				...data.messages,
				...newData,
			],
			badMembers: [
				...data.badMembers,
				member.id,
			],
		});
	},
};
