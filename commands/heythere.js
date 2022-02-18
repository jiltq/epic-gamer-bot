const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Decor = require('../Decor.js');
const utility = require('../utility.js');
const text = 'buddy, chum, pal, friend, buddy, pal, chum, bud, friend, fella, bruther, amigo, pal, buddy, friend, chummy, chum chum, pal i don\'t mean to be rude, my friend, pal, home slice, bread slice, dawg. but i gotta warn ya, if you take one more diddly darn step right there, i\'m gonna have to diddly darn snap your neck. and wowza, wouldn\'t that be a crummy juncture, huh? do you want that? do you wish upon yourself to come into physical experience with a crummy juncture? because friend, buddy, chum, friend, chum, pally pal, chum, friend, if you keep this up, then well gosh diddly darn, i might have to get not so friendly with you, my friendly friend friend, pal, friend, buddy, chum, pally, friend, chum, buddy.';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('heythere')
		.setDescription('STOP'.repeat(100 / 4)),
	async execute(interaction) {
		if (utility.random([ 0, 1, 1, 1]) == 1) throw new TypeError('Cannot read properties of null (reading \'data\')');
		const file = Decor.getIconAttachment('error_icon');
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'command error'.repeat(256 / 'command error'.length), iconURL: 'attachment://error_icon.png' })
			.setTitle('hey there,')
			.setColor(Decor.embedColors.error)
			.setThumbnail('https://cdn.discordapp.com/attachments/816126601184018472/866472673915568128/sans.png')
			.setDescription(text)
			.setFooter({ text: 'an error report has been sent to jiltq'.repeat(2046 / 'an error report has been sent to jiltq'.length) });
		interaction.reply({ embeds: [embed], files: [file] });
	},
};
