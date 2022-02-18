const EventEmitter = require('events');

class Emitter extends EventEmitter {}

class WebhookSignalManager extends EventEmitter {
	constructor() {
		super();
		this.webhook = null;
		this.signalId = null;
	}
	async createWebhook(channel) {
		this.signalId = Math.random().toString();
		const webhooks = await channel.fetchWebhooks();
		const availableWebhooks = webhooks.filter(whook => whook.name == 'eg-available');
		if (availableWebhooks.size > 0) {
			this.webhook = availableWebhooks.first();
		}
		else {
			const webhook = await channel.createWebhook('eg-available', {
				avatar: 'https://cdn.discordapp.com/avatars/695662672687005737/1df262cf976b36df54ab8d19198da17e.png',
				reason: 'automated webhook signal system',
			});
			this.webhook = webhook;
		}
	}
	async listen(client, method) {
		client.on('messageCreate', async (message) =>{
			if (message.webhookId == this.webhook.id) {
				const json = JSON.parse(message.content);
				if (json.signalId == this.signalId) {
					// this.emit('website2bot', { json });
					await method({ json, client });
				}
			}
		});
	}
	async setup(channel) {
		this.signalId = Math.random().toString();
		const webhooks = await channel.fetchWebhooks();
		const availableWebhooks = webhooks.filter(whook => whook.name == 'egb-available');
		if (availableWebhooks.size > 0) {
			this.webhook = availableWebhooks.first();
		}
		else {
			const webhook = await channel.createWebhook('egb-available', {
				avatar: 'https://cdn.discordapp.com/avatars/695662672687005737/1df262cf976b36df54ab8d19198da17e.png',
				reason: 'automated webhook signal system',
			});
			this.webhook = webhook;
		}
		channel.client.on('messageCreate', async (message) =>{
			if (message.webhookId == this.webhook.id) {
				const json = JSON.parse(message.content);
				if (json.signalId == this.signalId) {
					this.emit('website2bot', json);
					await message.delete();
				}
			}
		});
	}
	createRedirect(url, data) {
		return `${url}?${new URLSearchParams(data)}&signalId=${this.signalId}&webhookurl=${this.webhook.url}`;
	}
}
module.exports = WebhookSignalManager;