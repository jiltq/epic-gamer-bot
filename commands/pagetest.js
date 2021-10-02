const Discord = require('discord.js');
const pageHelper = require('../pageHelper');

module.exports = {
	name: 'pagetest',
	description: 'pagetest',
	category: 'dev',
	args: false,
	hidden: true,
	async execute(message, args, IPM) {
		const embed1 = new Discord.MessageEmbed()
			.setTitle('embed1');
		const embed2 = new Discord.MessageEmbed()
			.setTitle('embed2');
		message.channel.send({embeds: [embed1]}).then(async newMessage =>{
			const list = [
				embed1,
				embed2,
			];
			const PageHelper = new pageHelper.PageHelper(message, IPM, newMessage, true);
			await PageHelper.start(list);
		});
	},
};
