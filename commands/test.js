const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Worker } = require('worker_threads');

const scopes = [
	'identify',
	'email',
	'connections',
	'guilds',
];

// 695662672687005737
module.exports = {
	experimental: true,
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('testing things'),
	async execute(interaction) {
		await interaction.deferReply();
		if (interaction.user.id != '695662672687005737') return interaction.editReply({ content: 'ERR UNAUTHORIZED', ephemeral: true });

		const oauth2URL = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=${scopes.join('%20')}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('oauth2 url')
			.setURL(oauth2URL);

		const worker = new Worker(`${process.cwd()}/oauth2Server.js`, {
			workerData: {
				scopes: scopes,
			},
		});

		await interaction.editReply({ embeds: [embed] });

		worker.on('message', async message =>{
			console.log(message);
			if (message.status == 'data get') {
				console.log(message.data);
				const data = message.data;
				const userEmbed = new Discord.MessageEmbed()
					.setAuthor({ name: 'oauth2 authorized' })
					.setTitle(data.user.username);
				await interaction.followUp({ embeds: [userEmbed] });
				const connectionsEmbed = new Discord.MessageEmbed()
					.setAuthor({ name: 'oauth2 authorized' })
					.setTitle('your connections');
				for (const connection of data.connections) {
					connectionsEmbed.addField(connection.type, connection.name, true);
				}
				await interaction.followUp({ embeds: [connectionsEmbed] });
			}
		});
	},
};
