module.exports = {
	name: 'stop',
	description: 'stops the currently playing music and leaves the vc',
	category: 'music',
	usage: '',
	args: false,
	async execute(message) {
		const voiceConnection = message.client.voice.connections.filter(connection => connection.channel == message.member.voice.channel).first();
		if (!voiceConnection) return message.react('❌');
		voiceConnection.disconnect();
		message.react('✅');
	},
};
