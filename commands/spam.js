const Discord = require('discord.js');

module.exports = {
	name: 'spam',
	description: 'Spams chat, because why not?',
	args: false,
	usage: '[time to spam, optional message to send]',
	category: 'dev',
	async execute(message, args) {
		const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
		while (true) {
			await message.channel.send(trim('jeg is stupid :joy:\n'.repeat(1000), 2000));
		}
		return;
		let time = args[0] * 1000;
		if (time > 10000) time = 10000;
		let text = args[1] || 'e';
		text = text.replace(/@/gi, '');
		const timeToStop = Date.now() + time;
		const embed = new Discord.MessageEmbed()
			.setTitle(`Now spamming #${message.channel.name} for ${time / 1000} second(s)...`);
		await message.channel.send(embed);
		do {
			await message.channel.send(text);
		}
		while ((timeToStop - Date.now()) > 0);
	},
};
