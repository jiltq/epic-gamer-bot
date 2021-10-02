const udm = require('../userdatamanager.js');

module.exports = {
	name: 'subscribe',
	description: 'subscribe to announcements',
	async execute(message, args, IPM) {
		const name = args[0];

		const data = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/subscriptions.json');
		if (!data.active.includes(name)) { return message.reply('There aren\'t any subsciptions currently active with that name!'); }
		// else if (data.subscribed[message.author.id] == name) { message.reply('You are already subscribed to this!'); }
		else if ((await udm.readProperty(message.author.id, 'subscriptions')).includes(name)) {
			message.reply('You are already subscribed to this!');
		}
		else {
			await udm.writeProperty(message.author.id, 'subscriptions', [...await udm.readProperty(message.author.id, 'subscriptions'), name]);
			message.reply(`ok buster you're now subscribed to \`${name}\`, you'll get notified when there are any updates`);
			/*
			data.subscribed[message.author.id] = name;
			IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/subscriptions.json', 'subscribed', data.subscribed)
				.then(async () =>{
					message.reply(`ok buster you're now subscribed to \`${name}\`, you'll get notified when there are any updates`);
				})
				.catch(err => console.log(err));
			*/
		}
	},
};
