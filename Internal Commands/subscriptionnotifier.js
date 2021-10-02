const Discord = require('discord.js');

module.exports = {
	name: 'subscriptionnotifer',
	async execute(options) {
		const client = options.client;
		const IPM = options.IPM;
		client.on('message', async message =>{
			const data = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/subscriptions.json');
			if (message.channel.id == '745665195719917608') {
				const entries = Object.entries(data.subscribed);
				let key;let value;
				for ([key, value] of entries) {
					if (value == 'changelogs') {
						const user = client.users.cache.get(key);
						const embed = new Discord.MessageEmbed()
							.setTitle(`${message.author.username} posted in #${message.channel.name}`)
							.setURL(message.url)
							.setDescription(message.content);
						user.send({embeds: [embed]});
					}
				}
			}
		});
	},
};
