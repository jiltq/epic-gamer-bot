module.exports = {
	name: 'random',
	description: 'random number',
	execute(message, args) {
		message.channel.send(Math.random());
	},
};
