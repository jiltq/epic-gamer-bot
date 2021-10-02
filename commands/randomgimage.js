const Discord = require('discord.js');

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[{]}|;:,<.>/';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


module.exports = {
	name: 'randomgimage',
	description: 'Get a random image from google. Why?',
	async execute(message, args, IPM) {
		return;
		const random = Math.round(Math.random() * 100);
		const query = makeid(random);
		if (query == '' || query == null) return await module.exports.execute(message, args, IPM);
		const image = await IPM.return_command_data('gimage', [query], 0);
		if (!image) return await module.exports.execute(message, args, IPM);
		if (!image.url) return await module.exports.execute(message, args, IPM);
		const embed = new Discord.MessageEmbed()
			.setTitle(`"${query}"`)
			.setImage(image.url);
		return message.channel.send({embeds:[embed]});
	},
};
