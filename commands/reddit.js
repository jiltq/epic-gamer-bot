const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const Discord = require('discord.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const utility = require('../utility.js');
const { embedColors, getIconAttachment } = require('../Decor.js');

const postCache = {};

const maxFetch = 100;

async function getPost(subreddit, blockNSFW) {
	const type = utility.random(['best', 'hot', 'rising', 'top']);
	const posts = await Web.fetch(`https://www.reddit.com/r/${subreddit}/${type}.json?limit=${maxFetch}`);
	postCache[subreddit] = posts.data.children.filter(child => !child.data.is_video && (blockNSFW ? !child.nsfw : !child.nsfw || child.nsfw));
	return (utility.random(postCache[subreddit])).data;
}

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
	async execute(interaction) {
		const file = getIconAttachment('reddit_icon');
		const id = Math.random().toString();
		const post = await getPost(interaction.options.getString('subreddit'), false);
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setEmoji('<:egb_loop:899358138849955920>')
					.setLabel('refresh')
					.setCustomId(`${id}refresh`)
					.setStyle('PRIMARY'),
			);
		const embed = new Discord.MessageEmbed()
			.setAuthor(`r/${interaction.options.getString('subreddit')}  •  u/${post.author}`, 'attachment://reddit_icon.png', `https://www.reddit.com/r/${interaction.options.getString('subreddit')}`)
			.setTitle(trim(post.title, 256))
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setImage(post.url_overridden_by_dest)
			.setFooter(`👍 ${post.upvote_ratio * 100}%${post.over_18 ? ' | 😳 NSFW' : ''}`)
			.setDescription(post.selftext)
			.setColor(embedColors.reddit);
		await interaction.reply({ embeds: [embed], ephemeral: post.over_18, components: [row], files: [file] });
		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.customId.startsWith(id);

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId.endsWith('refresh')) {
				const newPost = (utility.random(postCache[interaction.options.getString('subreddit')])).data;
				embed.setAuthor(`r/${interaction.options.getString('subreddit')}  •  u/${newPost.author}`, 'attachment://reddit_icon.png', `https://www.reddit.com/r/${interaction.options.getString('subreddit')}`);
				embed.setImage(newPost.url_overridden_by_dest);
				embed.setTitle(trim(newPost.title, 256));
				embed.setURL(`https://www.reddit.com${newPost.permalink}`);
				embed.setFooter({ text: `👍 ${newPost.upvote_ratio * 100}%${newPost.over_18 ? ' | 😳 NSFW' : ''}` });
				embed.setDescription(newPost.selftext);
				await i.update({ embeds: [embed], ephemeral: newPost.over_18, components: [row], files: [file] });
				collector.resetTimer();
			}
		});
		collector.on('end', async () =>{
			for (const component of row.components) {
				component.setDisabled(true);
			}
			return interaction.editReply({ embeds: [embed], components: [row] });
		});
	},
};
