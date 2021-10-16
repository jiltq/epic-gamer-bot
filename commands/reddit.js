const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();
const Discord = require('discord.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const utility = require('../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('get reddit posts')
		.addStringOption(option =>
			option
				.setName('subreddit')
				.setDescription('subreddit to get posts from')
				.setRequired(true),
		),
	defer: true,
	async execute(interaction) {
		const posts = await web.fetch(`https://www.reddit.com/r/${interaction.options.getString('subreddit')}/best.json`);
		const post = (utility.random(posts.data.children)).data;
		const embed = new Discord.MessageEmbed()
			.setAuthor(`u/${post.author}`)
			.setTitle(trim(post.title, 256))
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setImage(post.url_overridden_by_dest)
			.setFooter(`👍 ${post.ups}`);
		if (post.selftext) embed.setDescription(post.selftext);
		return interaction.editReply({ embeds: [embed] });
	},
};
