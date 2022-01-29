const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Json = require('../jsonHelper.js');

const Store = require('../storeHelper.js');
const WebhookSignalManager = require('../webhookSignalManager.js');

const utility = require('../utility.js');

// Make sure they sound appealing!
const egverseDescription = 'is a virtual server ecosystem that makes it easy to find and create communities centered around your interests';
const egPointsDescription = 'are like in-game currency, except for the eg-verse. you earn eg-points when you do certain things, and you can spend them on items in the eg-points store';

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
	experimental: true,
	data: new SlashCommandBuilder()
		.setName('egverse')
		.setDescription('interact with the eg-verse')
		.addSubCommand(subcommand =>
			subcommand
				.setName('servers')
				.setDescription('lists available servers'))
		.addSubCommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('view info about the eg-verse'))
		.addSubCommand(subcommand =>
			subcommand
				.setName('inventory')
				.setDescription('view your 🌌 eg-points inventory'))
		.addSubCommand(subcommand =>
			subcommand
				.setName('store')
				.setDescription('view the 🌌 eg-points store')),
	/*
		.addSubCommand(subcommand =>
			subcommand
				.setName('buy')
				.setDescription('buy an item from the 🌌 eg-points store')
				.addStringOption(option =>{
					option.setName('item');
					option.setDescription('item to buy');

					const store = new Store();

					const itemList = store.getItemList();

					option.addChoices(Object.values(itemList).map(category => Object.values(category).map(item => [item, `buyitem_${item}`])));

					for (const category in itemList) {
						for (const item in itemList[category]) {
							option.addChoice(item, `buyitem_${item}`);
						}
					}
					return option.setRequired(true);
				})),
	*/
	execution: {
		'store': async function(interaction) {
			const webhookSignalManager = new WebhookSignalManager();
			await webhookSignalManager.setup(interaction.channel);

			const store = new Store();

			const itemList = await store.getItemList();

			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: 'eg-verse', iconURL: 'https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png' })
				.setTitle('🛒 eg-points store')
				.setColor('#2f3136')
				.setDescription(`your eg-points: **$${(await store.getUserData(interaction.user.id)).points}**`)
				.setFooter({ text: 'click an item to buy it' });

			for (const category in itemList) {
				let fieldValue = '';
				const items = itemList[category];

				for (const item in items) {
					fieldValue = fieldValue.concat(`\n• [${item}](${webhookSignalManager.createRedirect('https://eg-messenger.herokuapp.com/linkbutton', { item: item, userId: interaction.member.id })}): $${items[item]}`);
				}
				embed.addField(category, fieldValue);
			}
			await interaction.reply({ embeds: [embed], ephemeral: true });
			webhookSignalManager.on('website2bot', async (json) =>{
				const result = await store.buyItem(json.userId, json.item);
				const followUpEmbed = new Discord.MessageEmbed()
					.setTitle(result.success ? `bought 1 "${json.item}"` : result.reason);
				await interaction.followUp({ embeds: [followUpEmbed] });
			});
		},
		'inventory': async function(interaction) {
			const webhookSignalManager = new WebhookSignalManager();
			await webhookSignalManager.setup(interaction.channel);

			const store = new Store();

			const { inventory } = await store.getUserData(interaction.user.id);

			const types = utility.removeDupes(inventory);

			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: 'eg-verse', iconURL: 'https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png' })
				.setTitle('your inventory')
				.setColor('#2f3136')
				.setFooter({ text: 'click an item to use it' });

			let desc = '';
			for (const type of types) {
				const amount = inventory.filter(item => item == type).length;
				desc = desc.concat(`\n\n**[${type}](${webhookSignalManager.createRedirect('https://eg-messenger.herokuapp.com/linkbutton', { item: type, userId: interaction.member.id })})** \`x${amount}\``);
			}
			embed.setDescription(desc);

			await interaction.reply({ embeds: [embed], ephemeral: true });
			webhookSignalManager.on('website2bot', async (json) =>{
				console.log(json);
				await store.useItem(json.item, interaction);
			});
		},
		'servers': async function(interaction) {
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
		'info': async function(interaction) {
			const embed = new Discord.MessageEmbed()
				.setAuthor({ name: '🌌 eg-verse' })
				.setColor('#2f3136')
				.setTitle('the eg-verse')
				.setThumbnail('https://cdn.discordapp.com/attachments/816126601184018472/926583837679579136/milky-way_1f30c.png')
				.setDescription(egverseDescription)
				.addField('eg-points', egPointsDescription);
			interaction.reply({ embeds: [embed], ephemeral: true });
		},
	},
};
