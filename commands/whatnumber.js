const Discord = require('discord.js');
const difficulty = 1;
let max = 10;
const min = 1;

module.exports = {
	name: 'whatnumber',
	description: 'guess the number between 1-10!',
	category: 'games',
	async execute(message, args) {
		if (args.length) {
			max = Math.abs(parseFloat(args.join(' ')));
			if (isNaN(max)) return message.reply('try that again but this time actually provide a number');
		}
		else {max = 10;}
		const number = Math.floor(Math.random() * (max - min + 1)) + min;
		const embed = new Discord.MessageEmbed()
			.setAuthor(`ok im thinking of a number in the range of 1-${max}, what is it?`)
			.setFooter(message.author.username, message.author.avatarURL())
			.setDescription('you have 15 seconds!');
		message.reply(embed);
		const filter = m => m.author == message.author;
		const collector = message.channel.createMessageCollector(filter, { time: 15000 });

		collector.on('collect', m => {
			if (!isNaN(parseFloat(m.content))) {
				collector.stop();
				if (m.content == number.toString()) {
					const winembed = new Discord.MessageEmbed()
						.setColor('#007F00')
						.setAuthor(`congratulations, you guessed the number!! respect + ${max * 10}`)
						.setFooter(message.author.username, message.author.avatarURL());
					if (!args.length) embed.setDescription('ready for a harder challenge? try `?whatnumber [max number]` to set your own difficulty!');
					message.channel.send(winembed);
				}
				else {
					const loseembed = new Discord.MessageEmbed()
						.setColor('#7F0000')
						.setAuthor(`oof, the number was: ${number}`)
						.setFooter(message.author.username, message.author.avatarURL());
					if (parseFloat(m.content) > max || parseFloat(m.content) < 1) {
						loseembed.setDescription(`${m.content} wasn't even an option, lol`);
					}
					message.channel.send(loseembed);
				}
			}
		});

		collector.on('end', collected => {
			if (collected.size == 0) {
				message.channel.send(`**you didnt guess in time! the number was: \`${number}\`**`);
			}
		});
	},
};
