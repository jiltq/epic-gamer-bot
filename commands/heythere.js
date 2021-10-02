const Discord = require('discord.js');

const text = 'buddy, chum, pal, friend, buddy, pal, chum, bud, friend, fella, bruther, amigo, pal, buddy, friend, chummy, chum chum, pal i don\'t mean to be rude, my friend, pal, home slice, bread slice, dawg. but i gotta warn ya, if you take one more diddly darn step right there, i\'m gonna have to diddly darn snap your neck. and wowza, wouldn\'t that be a crummy juncture, huh? do you want that? do you wish upon yourself to come into physical experience with a crummy juncture? because friend, buddy, chum, friend, chum, pally pal, chum, friend, if you keep this up, then well gosh diddly darn, i might have to get not so friendly with you, my friendly friend friend, pal, friend, buddy, chum, pally, friend, chum, buddy.';

module.exports = {
	name: 'heythere',
	description: 'STOP'.repeat(1024 / 4),
	category: 'fun',
	args: false,
	async execute(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.member.displayName, message.author.displayAvatarURL())
			.setTitle('hey there,')
			.setURL('https://calanii.tumblr.com/post/131607340870/you-guys-asked-for-it-quality-sans-from-utg')
			.setThumbnail('https://cdn.discordapp.com/attachments/816126601184018472/866472673915568128/sans.png')
			.setDescription(text);
		return message.channel.send(embed);
	},
};
