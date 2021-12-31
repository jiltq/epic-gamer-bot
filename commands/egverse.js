const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const servers = [
	{
		name: 'epic gamers',
		invite: 'NnhuHJCFS9',
		id: '696079746697527376',
		public: true,
	},
	{
		name: 'quote land',
		invite: 'X3uaDp8MuQ',
		id: '810280092013428807',
		public: true,
	},
	{
		name: 'the disappointments',
		invite: 'xSMq8ZjRw9',
		id: '925170672399970324',
		public: false,
		access: ['695662672687005737', '847982205388980254', '536344399492284439', '803445340531458088'],
	},
	{
		name: 'eg-verse hub',
		invite: 'dpm95JnQfu',
		id: '926307504533680169',
		public: true,
	},
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('egverse')
		.setDescription('access servers in the eg-verse'),
	async execute(interaction) {
		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: '🌌 eg-verse' })
			.setColor('#2f3136')
			.setTitle('available servers')
			.setThumbnail('https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png');
		for (const server of servers) {
			let goOn = server.public;
			if (!server.public) {
				if (server.access.includes(interaction.user.id)) {
					goOn = true;
				}
			}
			if (goOn && server.id != interaction.guild.id) {
				embed.addField(server.name, `[take me there](https://discord.gg/${server.invite})`);
			}
			else if (goOn && server.id == interaction.guild.id) {
				embed.addField(server.name, 'you are here!');
			}
		}
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
