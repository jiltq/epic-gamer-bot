module.exports = {
	name: 'sort',
	description: 'sort values alphabetically',
	async execute(message, args) {
		const unsortedArray = args;
		const sortedArray = unsortedArray.sort();
		return message.channel.send({ content: sortedArray.join(', ') });
	},
};
