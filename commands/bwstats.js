const Discord = require('discord.js');

module.exports = {
	name: 'bwstats',
	description: 'View the stats for a Blocksworld player',
	args: true,
	async execute(message, args, IPM) {
		const id = args[0];
		const response = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/users/${id}/basic_info`);
		const followers = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/user/${id}/followers`);
		const followed = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/user/${id}/followed_users`);
		const liked = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/users/${id}/liked_worlds?page=1`);
		const worlds = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/users/${id}/worlds?kind=recent&page=1`);
		const models = await IPM.fetch(`https://bwsecondary.ddns.net:8080/api/v1/users/${id}/u2u_models?page=1`);
		let likes = worlds.worlds.map(world => world.likes_count);
		likes = likes.reduce(function(a, b) {
			return a + b;
		}, 0);
		console.log(response);
		const embed = new Discord.MessageEmbed()
			.setAuthor('Blocksworld', 'https://bwsecondary.ddns.net:8080/images/categories/default_pfp.png')
			.setTitle(response.username)
			.setThumbnail(response.profile_image_url)
			.addField('ID', response.id, true)
			.addField('Coins', response.coins, true)
			.addField('Premium', response.blocksworld_premium != 0, true)
			.addField('Followers', followers.attrs_for_follow_users.length, true)
			.addField('Following', followed.attrs_for_follow_users.length, true)
			.addField('Liked Worlds', liked.worlds.length, true)
			.addField('World Likes', likes, true)
			.addField('Models', models.u2u_models.length, true)
			.addField('Worlds', worlds.worlds.length, true);
		message.channel.send(embed);
	},
};
