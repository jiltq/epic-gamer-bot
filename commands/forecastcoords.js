const Discord = require('discord.js');

module.exports = {
	name: 'forecastcoords',
	description: 'Shows the available cities for the ?forecast command',
	category: 'weather',
	args: false,
	async execute(message, args, IPM) {
		const { coordinates } = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/coordinates.json');
		const names = Object.keys(coordinates);
		names.forEach(async (name, index) => names[index] = `**${name}**`);
		const embed = new Discord.MessageEmbed()
			.setTitle('Current Cities Available :flag_us:')
			.setDescription(names.join(' | | '))
			.setFooter('To add more cities, simply use "?forecast (coordinates)"');
		return message.channel.send(embed);
	},
};
