const settings = require('../JSON/serverSettings.json');
const Discord = require('discord.js');

module.exports = {
	name: 'settings',
	description: 'Modify your server\'s settings',
	category: 'utility',
	permissions: 'MANAGE_GUILD',
	args: false,
	async execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Settings for ${message.guild.name}`)
			.setDescription('To modify a setting, use "?settings <setting> <new value>"');
		Object.keys(settings.servers[message.guild.id]).forEach(async key =>{
			embed.addField(`${key} - ${settings.servers[message.guild.id][key]}`, settings.info[key], true);
		});
		return message.channel.send({ embeds: [embed] });
	},
};
