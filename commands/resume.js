module.exports = {
	name: 'resume',
	description: 'Resume the currently paused music',
	usage: '',
	args: false,
	async execute(message) {
		const voiceConnection = message.client.voice.connections.filter(connection => connection.channel == message.member.voice.channel).first();
		if (!voiceConnection) return message.react('❌');
		voiceConnection.dispatcher.resume();
		message.react('✅');
	},
};
