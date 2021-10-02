const Discord = require('discord.js');

module.exports = {
	name: 'credits',
	description: 'displays credits for material epic gamer bot utilizes',
	async execute(message, args, IPM) {
		const { commands } = message.client;
		const credits = commands.map(command => command.credits).filter(credit => credit != null);
		const embed = new Discord.MessageEmbed()
			.setTitle('epic gamer bot credits')
			.setDescription('epic gamer bot uses many components made by others in order to make magic happen!')
			.addField('Main Developer', 'jiltq#7476 <:biltq:800143977432088616>')
			.addField('e', 'e')
			.setFooter('modules used by epic gamer bot are listed in their respective command embeds');
	},
};
