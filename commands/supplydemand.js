module.exports = {
	name: 'ping',
	description: 'Ping',
	async execute(message, args) {
		message.channel.send(`🏓Average websocket shards ping is ${Math.round(message.client.ws.ping)}ms`);
	},
};
