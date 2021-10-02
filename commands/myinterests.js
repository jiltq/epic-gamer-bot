const Discord = require('discord.js');

module.exports = {
	name: 'myinterests',
	description: 'Shows data regarding automatic events interests',
	category: 'utility',
	args: false,
	async execute(message, args, IPM) {
		const gamedata = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/eventData.json');
		const games = gamedata.games.filter(game => game.players.includes(message.member.id));
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Interests`)
			.setThumbnail(await message.author.displayAvatarURL())
			.setDescription('These interests are used in auto events to connect you with other players like you');
		for (let i = 0;i < games.length;i++) {
			embed.addField(games[i].name, `**${games[i].players.length - 1}** players also play this game`, true);
		}
		return message.channel.send({ embeds: [embed] });
	},
};
