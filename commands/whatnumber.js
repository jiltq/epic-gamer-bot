const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColors } = require('../Decor.js');
const { randomInt } = require('../utility.js');
let max = 10;
const min = 1;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whatnumber')
		.setDescription('guess the number!')
		.addIntegerOption(option =>
			option
				.setName('max')
				.setDescription('maximum value in the range')
				.setRequired(false),
		),
	async execute(interaction) {
		max = interaction.options.getInteger('max') ? interaction.options.getInteger('max') : 10;

		const number = randomInt(min, max);
		const embed = new Discord.MessageEmbed()
			.setTitle(`ok, i'm thinking of a number in the range of 1-${max}, what is it?`)
			.setFooter(interaction.user.username, interaction.user.avatarURL())
			.setDescription('you have 15 seconds!')
			.setColor(embedColors.default);
		interaction.reply({ embeds: [embed] });
		const filter = m => m.author.id == interaction.user.id;
		const collector = interaction.channel.createMessageCollector(filter, { time: 15000 });

		collector.on('collect', async m => {
			if (!isNaN(parseInt(m.content))) {
				collector.stop();
				if (parseInt(m.content) == number) {
					const winembed = new Discord.MessageEmbed()
						.setColor(embedColors.success)
						.setTitle(`congratulations, you guessed the number!! respect + ${max * 10}`);
					// if (!args.length) embed.setDescription('ready for a harder challenge? try `?whatnumber [max number]` to set your own difficulty!');
					interaction.followUp({ embeds: [winembed] });
				}
				else {
					const loseembed = new Discord.MessageEmbed()
						.setTitle(`oof, the number was: ${number}`)
						.setColor(embedColors.failure);
					if (parseFloat(m.content) > max || parseFloat(m.content) < 1) {
						loseembed.setDescription(`${m.content} wasn't even an option, lol`);
					}
					interaction.followUp({ embeds: [loseembed] });
				}
			}
		});

		collector.on('end', collected => {
			if (collected.size == 0) {
				interaction.followUp(`**you didnt guess in time! the number was: \`${number}\`**`);
			}
		});
	},
};
