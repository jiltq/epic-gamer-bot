const Discord = require('discord.js');

module.exports = {
	name: 'feedback',
	description: 'Ping',
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('epic gamers feedback')
			.setDescription('**if you would like to provide feedback for Epic Gamers, please take this survey.**')
			.setURL('https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAANDs-IdUMjJDUzJZUjY3SDBDVE4xTkpKMFJXNEY2TC4u')
			.setImage('https://cdn.discordapp.com/attachments/759596141032767498/764915492741316638/blur.png');
		message.channel.send(embed);
	},
};
