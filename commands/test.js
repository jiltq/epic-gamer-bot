const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const WebhookSignalManager = require('../webhookSignalManager.js');
const Web = require('../Web.js');
const Json = require('../Json.js');

const scopes = [
	'identify',
	'email',
	'connections',
];

// 695662672687005737
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('testing things'),
	async execute(interaction) {
		await interaction.deferReply();
		// if (interaction.user.id != '695662672687005737') return interaction.editReply({ content: 'ERR UNAUTHORIZED', ephemeral: true });

		const webhookSignalManager = new WebhookSignalManager();
		await webhookSignalManager.setup(interaction.channel);

		const oauth2URL = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&redirect_uri=https%3A%2F%2Feg-messenger.herokuapp.com%2Foauth2&response_type=token&scope=${scopes.join('%20')}&state=${JSON.stringify({ webhookURL: webhookSignalManager.webhook.url, signalId: webhookSignalManager.signalId })}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('oauth2 url')
			.setURL(oauth2URL);

		interaction.editReply({ embeds: [embed] });

		webhookSignalManager.on('website2bot', async (json) =>{
			console.log(json);
			const data = await Web.fetch('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${json.tokenType} ${json.accessToken}`,
				},
			});
			const data2 = await Web.fetch('https://discord.com/api/users/@me/connections', {
				headers: {
					authorization: `${json.tokenType} ${json.accessToken}`,
				},
			});
			console.log(data);
			console.log(data2);
			const jsonData = await Json.read(Json.formatPath('userConnections'));
			if (!jsonData.users[interaction.user.id]) {
				jsonData.users[interaction.user.id] = { connections: [] };
			}
			jsonData.users[interaction.user.id].connections = data2;
			await Json.write(Json.formatPath('userConnections'), jsonData);

			interaction.followUp({ content: 'successfully added your 3rd-party connections' });

			console.log(await Web.auth('spotify'));
		});
	},
};
