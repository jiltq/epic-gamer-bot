const Discord = require('discord.js');

module.exports = {
	name: 'susmeter',
	description: 'How sus are you?',
	args: false,
	category: 'fun',
	async execute(message) {
		const number = Math.random();
		const percent = number * 100;
		let emoji = '<:laugh:810223562311991418>';
		if (percent > 25) emoji = '<:uhhhhh:803087554140045353>';
		if (percent > 50) emoji = '🤔';
		if (Math.round(percent) == 69) emoji = '<:ok_cool:803029050443825192>';
		if (percent > 75) emoji = '😳';
		const embed = new Discord.MessageEmbed()
			.setTitle(`you are \`${Math.round(percent)}%\` sus ${emoji}`);
		return message.channel.send({ embeds: [embed] });
	},
};
