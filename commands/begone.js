module.exports = {
	name: 'begone',
	description: 'Initiates Epic Gamer Bot to leave whichever server he\'s currently in',
	category: 'dev',
	args: false,
	hidden: true,
	async execute(message) {
		if (message.author.id != '695662672687005737') return message.channel.send('err: user not authorized');
		message.guild.leave();
	},
};
