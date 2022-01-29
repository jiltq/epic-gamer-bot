const { SlashCommandBuilder } = require('@discordjs/builders');

const commandTypes = {
	'CHAT_INPUT': 1,
	'USER': 2,
	'MESSAGE': 3,
};
const optionTypes = {
	'SUB_COMMAND': 1,
	'SUB_COMMAND_GROUP': 2,
	'STRING': 3,
	'INTEGER': 4,
	'BOOLEAN': 5,
	'USER': 6,
	'CHANNEL': 7,
	'ROLE': 8,
	'MENTIONABLE': 9,
	'NUMBER': 10,
};

class Command {
	constructor() {
		this.data = {
			name: null,
			type: 1,
			description: null,
			options: [],
		};
	}
	setName(name) {

	}
	addOption() {

	}
	async execute(interaction) {

	}
}