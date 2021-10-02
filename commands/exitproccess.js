module.exports = {
	name: 'exitprocess',
	description: 'Exit the current process, ultimately shutting down epic gamer bot',
	category: 'dev',
	args: false,
	async execute(message) {
		if (message.author.id != '695662672687005737') return message.channel.send('haha nice try');
		await message.channel.send('\\✨ *epic gamer bot ceases to exist* \\✨');
		process.exit();
	},
};
