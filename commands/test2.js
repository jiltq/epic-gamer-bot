const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const Json = require('../Json.js');

// 695662672687005737
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test2')
		.setDescription('testing more things'),
	async execute(interaction) {
		await interaction.deferReply();
		if (interaction.user.id != '695662672687005737') return interaction.editReply({ content: 'ERR UNAUTHORIZED', ephemeral: true });

		const { access_token, token_type } = await Web.auth('spotify');

		const connectionData = await Json.read(Json.formatPath('userConnections'));

		if (!connectionData.users[interaction.user.id]) return;

		const spotifyConnection = connectionData.users[interaction.user.id].connections.find(connection => connection.type == 'spotify');
		if (!spotifyConnection) return;

		const spotifyProfile = await Web.fetch(`https://api.spotify.com/v1/users/${spotifyConnection.id}`, {
			method: 'GET',
			headers: {
				'Authorization': `${token_type} ${access_token}`,
				'Content-Type': 'application/json',
			},
		});
		console.log(spotifyProfile);
	},
};
