const fs = require('fs');

module.exports = {
	name: 'jiltqwifi',
	description: 'just *how* bad is jiltq\'s wifi??',
	async execute(message) {
		let existing_network_data = fs.readFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Debugging/howmanytimescanthenetworkscrewup.json');
		existing_network_data = JSON.parse(existing_network_data);
		const currentTime = Date.now() - existing_network_data.startingTime;
		message.channel.send(`Jiltq's wifi disconnects every **${1 / (existing_network_data.timesthenetworkcanscrewup / (currentTime / 3600000))}** hours!`);
	},
};
