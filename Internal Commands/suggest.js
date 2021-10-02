const data = require('../suggestdata.json');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
/*
  Epic Gamer Bot suggests using his music playing abilities instead of "competition"
*/
module.exports = {
	name: 'suggest',
	execute(options) {
		const message = options.message;
		const id = message.author.id;
		const newdata = JSON.parse(fs.readFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/suggestdata.json', 'utf8'));
		if (!newdata.userChance[id]) {
			newdata.userChance[id] = 0.25;
		}
		else {
			newdata.userChance[id] -= 0.05;
		}
		newdata.userChance[id] = newdata.userChance[id].toFixed(2);
		const chance = newdata.userChance[id];
		const random = Math.random().toFixed(chance.toString().length - 2);
		console.log(random);
		if (random <= chance) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('do you want high quality music? then try the official bot for epic gamers!')
				.setThumbnail(config.avatar)
				.setDescription(`**${config.username}** offers high quality* music playing, built from the ground up - by developers you trust**`)
				.setFooter('*during good internet quality\n**if you trust jiltq');
			message.channel.send(embed);
		}
		fs.writeFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/suggestdata.json', JSON.stringify(newdata));
	},
};
