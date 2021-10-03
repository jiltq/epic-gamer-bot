const Discord = require('discord.js');
const Json = require('../jsonHelper.js');

module.exports = {
	name: 'subscriptionnotifer',
	internal: true,
	async execute(options) {
		const client = options.client;
		client.on('messageCreate', async message =>{
			const json = new Json('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/subscriptions.json');
			const data = await json.read();
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
