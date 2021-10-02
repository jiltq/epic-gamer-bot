const Discord = require('discord.js');

const requests = 100;
module.exports = {
	name: 'dog',
	description: 'An image of a dog',
	category: 'animals',
	args: false,
	async execute(message, args, IPM) {
		const posts = await IPM.fetch(`https://www.reddit.com/r/dogs/hot.json?limit=${requests}`);
		const index = Math.floor(Math.random() * posts.data.children.filter(child => !child.data.is_self).length);
		const post = posts.data.children.filter(child => !child.data.is_self)[index].data;
		const embed = new Discord.MessageEmbed()
			.setAuthor(post.author)
			.setTitle(post.title)
			.setImage(post.url)
			.setFooter(`👍 ${post.ups}  `);
		console.log(post);
		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};
