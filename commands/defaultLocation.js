module.exports = {
	name: 'defaultlocation',
	description: 'Set your default location!',
	execute(message, args) {
		if (!args.length) {
			return message.reply('you have to provide a set of coordinates for me to set your default location to!')
		} else {
			return message.channel.send(`<@695662672687005737> update ${message.author.username}'s default location lol`);
		}
	},
};
