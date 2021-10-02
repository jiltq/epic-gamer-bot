module.exports = {
	name: 'stopdc',
	description: 'works just like the ?stop command, except epic gamer bot now disconnects the user as well',
	category: 'music',
	usage: '',
	args: false,
	async execute(message) {
		const voiceConnection = message.client.voice.connections.filter(connection => connection.channel == message.member.voice.channel).first();
		if (!voiceConnection) return message.react('❌');
		message.member.voice.kick('User executed ?stopdc command, which disconnected them');
		voiceConnection.disconnect();
		message.react('✅');
	},
};
