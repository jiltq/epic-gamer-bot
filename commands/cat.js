const Discord = require('discord.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const requests = 100;
module.exports = {
	name: 'cat',
	description: 'An image of a cat',
	category: 'animals',
	args: false,
	async execute(message, args, IPM) {
		const posts = await IPM.fetch(`https://www.reddit.com/r/cats/hot.json?limit=${requests}`);
		const index = Math.floor(Math.random() * posts.data.children.filter(child => !child.data.is_self).length);
		const post = posts.data.children.filter(child => !child.data.is_self)[index].data;
		const embed = new Discord.MessageEmbed()
			.setAuthor(post.author)
			.setTitle(trim(post.title, 256))
			.setImage(post.url)
			.setFooter(`👍 ${post.ups}  `);
		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};
