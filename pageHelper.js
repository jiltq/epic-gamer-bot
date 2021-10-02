const Discord = require('discord.js');
const time = 600000;
const numbertime = time * 0.1;
const back = '<';
const next = '>';

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

async function disableButtons(row, items, currentPage) {
	if (currentPage == 0) row.components[0].setDisabled(true);
	else row.components[0].setDisabled(false);
	if (items.length == 1) row.components[1].setDisabled(true);
	else row.components[1].setDisabled(false);
	if (currentPage == (items.length - 1)) row.components[2].setDisabled(true);
	else row.components[2].setDisabled(false);
}
async function updateInteraction(i, items, currentPage, row, isEmbed) {
	if (isEmbed) {
		await i.update({ embeds:[items[currentPage]], components: [row] });
	}
	else {
		await i.update({ content: items[currentPage].toString(), components: [row] });
	}
}
async function editMessage(newMessage, items, currentPage, row, isEmbed) {
	if (isEmbed) {
		newMessage.edit({ embeds:[items[currentPage]], components: [row] });
	}
	else {
		newMessage.edit({ content:[items[currentPage]].toString(), components: [row] });
	}
}

module.exports = {
	PageHelper: class PageHelper {
		constructor(message, IPM, newMessage, isEmbed = false, prevRow = { 'components':[] }) {
			this.message = message;
			this.IPM = IPM;
			this.newMessage = newMessage;
			this.isEmbed = isEmbed;
			this.prevRow = prevRow;
		}
		async start(items) {
			if (items == null) throw new Error('No items provided!');
			if (items.length < 1) throw new Error('No items provided!');
			let currentPage = 0;
			this.items = items;
			const row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setCustomId(`${back}${this.message.id}`)
						.setLabel(back)
						.setStyle('PRIMARY'),
					new Discord.MessageButton()
						.setCustomId(`num${this.message.id}`)
						.setEmoji('🔢')
						.setStyle('SECONDARY'),
					new Discord.MessageButton()
						.setCustomId(`${next}${this.message.id}`)
						.setLabel(next)
						.setStyle('PRIMARY'),
					...this.prevRow.components,
				);
			await disableButtons(row, this.items, currentPage);
			await editMessage(this.newMessage, this.items, currentPage, row, this.isEmbed);
			const filter = i => (i.customId == `${back}${this.message.id}` || i.customId == `${next}${this.message.id}` || i.customId == `num${this.message.id}`) && i.user.id == this.message.author.id;

			const collector = this.message.channel.createMessageComponentCollector({ filter, time: time });
			collector.on('collect', async i => {
				if (i.customId == `${back}${this.message.id}`) {
					currentPage--;
					await disableButtons(row, this.items, currentPage);
					await updateInteraction(i, this.items, currentPage, row, this.isEmbed);
					eventEmitter.emit('back');
				}
				else if (i.customId == `${next}${this.message.id}`) {
					currentPage++;
					await disableButtons(row, this.items, currentPage);
					await updateInteraction(i, this.items, currentPage, row, this.isEmbed);
					eventEmitter.emit('next');
				}
				else if (i.customId == `num${this.message.id}`) {
					const numfilter = m => !isNaN(parseInt(m.content)) && m.author.id == this.message.author.id;
					const numcollector = this.message.channel.createMessageCollector({ numfilter, time: numbertime });

					numcollector.on('collect', async m => {
						numcollector.stop();
						currentPage = parseInt(m.content - 1);
						await disableButtons(row, this.items, currentPage);
						await updateInteraction(i, this.items, currentPage, row, this.isEmbed);
					});
				}
			});
			collector.on('end', async () =>{
				await disableButtons(row, [0], 0);
				await editMessage(this.newMessage, this.items, currentPage, row, this.isEmbed);
			});
		}
		async returnList() {
			return this.items;
		}
		async editList(newlist) {
			this.items = newlist;
		}
		async addItem(newItem) {
			this.items.push(newItem);
			await disableButtons(this.row, this.items, this.currentPage);
			await updateInteraction(this.i, this.items, this.currentPage, this.row, this.isEmbed);
		}
		async events() {
			return eventEmitter;
		}
	},
};
