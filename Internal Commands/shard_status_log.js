module.exports = {
	async log(client) {
		client.on('shardReconnecting', id => console.log(`shard ${id} attempting to reconnect...`));
	},
};
