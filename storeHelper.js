const Json = require('./jsonHelper.js');
const WebhookSignalManager = require('./webhookSignalManager.js');
const Discord = require('discord.js');

/**
 * A helper class for managing the eg-points store
 */

const itemMethods = {
	'name color change': async function(interaction) {
		const isInHub = await interaction.client.shard.broadcastEval(async (c, context) => {
			const hub = await c.guilds.fetch('926307504533680169');
			return hub.members.cache.find(member => member.user.id == context.user.id) != null;
		}, { shard: 0, context: { user: interaction.user } });
		if (isInHub) {
			const webhookSignalManager = new WebhookSignalManager();
			await webhookSignalManager.createWebhook(interaction.channel);

			const colorRoles = await interaction.client.shard.broadcastEval(async (c, context) => {
				const hub = await c.guilds.fetch('926307504533680169');
				const roles = await hub.roles.fetch();
				return roles.filter(role => role.name.startsWith('color_'));
			}, { shard: 0, context: { user: interaction.user } });

			const colorEmbed = new Discord.MessageEmbed()
				.setTitle('what color would you like your name to be?')
				.setColor('#2f3136');

			let desc = '';
			for (const colorRole of colorRoles) {
				desc = desc.concat(`\n\n• **[${colorRole.name.split('_')[1]}](${webhookSignalManager.createRedirect('https://eg-messenger.herokuapp.com/linkbutton', { colorRoleId: colorRole.id, userId: interaction.member.id })})**`);
			}
			colorEmbed.setDescription(desc);
			await interaction.followUp({ embeds: [colorEmbed], ephemeral: true });
			await webhookSignalManager.listen(interaction.client, async ({ json }) =>{
				await interaction.client.shard.broadcastEval(async (c, { userId, roleId }) => {
					const hub = await c.guilds.fetch('926307504533680169');
					const member = await hub.members.fetch(userId);
					const existingColorRoles = member.roles.cache.filter(role => role.name.startsWith('color_'));
					existingColorRoles.every(async cRole =>{
						await member.roles.remove(cRole.id);
					});
					await member.roles.add(roleId);
				}, { shard: 0, context: { userId: interaction.user.id, roleId: json.colorRoleId } });
			});
			// note: change this return to actually return when the name color is changed
			return { success: true };
		}
		else {
			const joinEmbed = new Discord.MessageEmbed()
				.setTitle('you need to join the eg-verse hub to use this item!')
				.setColor('#ED4245');
			await interaction.followUp({ embeds: [joinEmbed], ephemeral: true });
			return { success: false };
		}
	},
	'advertise your server': async function(interaction) {
		const webhookSignalManager = new WebhookSignalManager();
		await webhookSignalManager.createWebhook(interaction.channel);

		const something = webhookSignalManager.createRedirect('https://discord.com/api/oauth2/authorize', { client_id: '700455539557269575', redirect_uri: 'https://eg-messenger.herokuapp.com/linkbutton', response_type: 'token', scope: 'identify' });
		interaction.followUp({ content: something });
		return { succes: true };
	},
};

class Store {
	constructor() {

	}
	async getUserData(userId) {
		const json = new Json(`${process.cwd()}/JSON/storeData.json`);
		const storeData = await json.read();
		if (!storeData.users[userId]) {
			storeData.users[userId] = storeData.userDataTemplate;
		}
		for (const key in storeData.userDataTemplate) {
			if (!storeData.users[userId][key]) {
				storeData.users[userId][key] = storeData.userDataTemplate[key];
			}
		}
		return storeData.users[userId];
	}
	async setUserData(userId, data) {
		const json = new Json(`${process.cwd()}/JSON/storeData.json`);
		const storeData = await json.read();
		storeData.users[userId] = data;
		await json.write(storeData);
	}
	async getItemList() {
		const json = new Json(`${process.cwd()}/JSON/storeData.json`);
		const storeData = await json.read();
		return storeData.itemList;
	}
	async getItemPrice(itemName) {
		const json = new Json(`${process.cwd()}/JSON/storeData.json`);
		const storeData = await json.read();

		let price = null;
		for (const category in storeData.itemList) {
			for (const item in storeData.itemList[category]) {
				if (item == itemName) price = storeData.itemList[category][item];
			}
		}
		return price;
	}
	async buyItem(userId, item) {
		const userData = await this.getUserData(userId);
		const price = await this.getItemPrice(item);
		if (!price) return { success: false, reason: `item "${item}" does not exist!` };

		if (userData.points < price) {
			return { success: false, reason: 'not enough points!' };
		}
		else {
			userData.points -= price;
			userData.inventory.push(item);
			await this.setUserData(userId, userData);
			return { success: true, reason: '' };
		}
	}
	async addPointsToUser(userId, points) {
		const userData = await this.getUserData(userId);
		userData.points += points;
		await this.setUserData(userId, userData);
	}
	async removePointsFromUser(userId, points) {
		const userData = await this.getUserData(userId);
		userData.points -= points;
		await this.setUserData(userId, userData);
	}
	async useItem(item, interaction) {
		if (!itemMethods[item]) throw new Error(`a method for item "${item}" does not exist!`);
		const result = await itemMethods[item](interaction);
		console.log(result);
		if (result.success) {
			const userData = await this.getUserData(interaction.user.id);
			const idk = userData.inventory.filter(_item => _item == item);
			const idk2 = userData.inventory.filter(_item => _item != item);
			idk.pop();
			userData.inventory = [...idk, ...idk2];
			await this.setUserData(interaction.user.id, userData);
		}
	}
}
module.exports = Store;