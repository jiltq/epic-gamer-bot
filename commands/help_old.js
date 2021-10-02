const Discord = require('discord.js');
const fetch = require('node-fetch');
async function cat() {
	const response = await fetch('https://aws.random.cat/meow');
	const myJson = await response.json(); // extract JSON from the http response
	var e = JSON.stringify(myJson);
	var a = JSON.parse(e);
	return(a["file"])
}
module.exports = {
	name: 'help_old',
	description: 'shows a help page for several commands',
	execute(message, args) {
		const args2 = args.join("")
		if (!args.length) {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#a88f7e')
				.setTitle('epic gamer bot commands')
				.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
				.addFields(
					{ name: 'animal commands', value: '`?help animals`', inline: true },
					{ name: 'weather commands', value: '`?help weather`', inline: true },
					{ name: 'music commands', value: '`?help music`', inline: true },
				)
				.addFields(
					{ name: 'moderation commands', value: '`?help moderation`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
				);

			return message.channel.send(exampleEmbed);
		}
		if (args2 == 'animals') {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#a88f7e')
				.setTitle('epic gamer bot animal commands')
				.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
				.addFields(
					{ name: '?cat', value: '`cat picture`', inline: true },
					{ name: '?dog', value: '`dog picture`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
				)
				.addFields(
					{ name: 'placeholder', value: '`placeholder`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
				);
			return message.channel.send(exampleEmbed);
		} else if (args2 == 'weather') {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#a88f7e')
				.setTitle('epic gamer bot weather commands')
				.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
				.addFields(
					{ name: '?forecast', value: '`get the forecast for a specified location`', inline: true },
					{ name: '?alerts', value: '`get active alerts for a specified location`', inline: true },
					{ name: '?defaultlocation', value: '`set your default location to be used by ?forecast or ?alerts when no arguments are given`', inline: true },
				)
				.addFields(
					{ name: 'placeholder', value: '`placeholder`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
					{ name: 'placeholder', value: '`placeholder`', inline: true },
				);
			return message.channel.send(exampleEmbed);
		} else if (args2 == 'music') {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#a88f7e')
				.setTitle('epic gamer bot music commands')
				.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
				.addFields(
					{ name: '?play', value: '`plays a link`', inline: true },
					{ name: '?pause', value: '`pauses the current song`', inline: true },
					{ name: '?resume', value: '`resumes the current song`', inline: true },
				)
				.addFields(
					{ name: '?volume', value: '`sets the volume of the song`', inline: true },
					{ name: '?stop', value: '`stops the current song`', inline: true },
					{ name: '?bitrate', value: '`changes the bitrate of the current song`', inline: true },
				);
			return message.channel.send(exampleEmbed);
		} else if (args2 == 'privacy') {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#a88f7e')
				.setTitle('epic gamer bot privacy information')
				.setDescription('epic gamer bot may/may not collect certain data about you while in use. here is a list of these instances')
				.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
				.addFields(
					{ name: 'game channels auto-management', value: '`epic gamer bot will use any game you are currently playing if it is added to discord, whether you are online or not. this is used to create new game channels xd`', inline: true },
				);
			return message.channel.send(exampleEmbed);
		}
	}
};
