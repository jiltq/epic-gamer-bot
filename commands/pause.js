module.exports = {
	name: 'pause',
	description: 'Pause the currently playing music',
	usage: '',
	args: false,
	async execute(message) {
		const voiceConnection = message.client.voice.connections.filter(connection => connection.channel == message.member.voice.channel).first();
		if (!voiceConnection) return message.react('❌');
		voiceConnection.dispatcher.pause(true);
		message.react('✅');
	},
};
