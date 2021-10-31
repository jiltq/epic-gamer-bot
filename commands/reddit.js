const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();
const Discord = require('discord.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const utility = require('../utility.js');

async function getPost(subreddit) {
	const type = utility.random(['best', 'hot', 'rising', 'top']);
	const posts = await web.fetch(`https://www.reddit.com/r/${subreddit}/${type}.json?limit=100`);
	return (utility.random(posts.data.children)).data;
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
		const id = Math.random().toString();
		const post = await getPost(interaction.options.getString('subreddit'));
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setEmoji('<:egb_loop:899358138849955920>')
					.setLabel('refresh')
					.setCustomId(`${id}refresh`)
					.setStyle('PRIMARY'),
			);
		let embed = new Discord.MessageEmbed()
			.setAuthor(`u/${post.author}`)
			.setTitle(trim(post.title, 256))
			.setURL(`https://www.reddit.com${post.permalink}`)
			.setImage(post.url_overridden_by_dest)
			.setFooter(`👍 ${post.upvote_ratio * 100}%${post.over_18 ? ' | 😳 NSFW' : ''}`);
		if (post.selftext) embed.setDescription(post.selftext);
		await interaction.reply({ embeds: [embed], ephemeral: post.over_18, components: [row] });
		const filter = i => (i.user.id == interaction.user.id || i.user.id == '695662672687005737') && i.customId.startsWith(id);

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });
		collector.on('collect', async i => {
			if (i.customId.endsWith('refresh')) {
				const modEmbed = embed;
				const newPost = await getPost(interaction.options.getString('subreddit'));
				modEmbed.setAuthor(`u/${newPost.author}`);
				modEmbed.setImage(newPost.url_overridden_by_dest);
				modEmbed.setTitle(trim(newPost.title, 256));
				modEmbed.setFooter(`👍 ${newPost.upvote_ratio * 100}%${newPost.over_18 ? ' | 😳 NSFW' : ''}`);
				await i.update({ embeds: [modEmbed], ephemeral: newPost.over_18, components: [row] });
				embed = modEmbed;
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
