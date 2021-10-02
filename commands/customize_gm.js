/*
const Discord = require('discord.js');

let defaultEmbed = {
	title: 'Good (partofday), (user)!',
	description: 'description',
};

const backupEmbed = {
	title: 'Good (partofday), (user)!',
	description: 'description',
};

const exampleEmbed = {
	color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/wSTFkRM.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/wSTFkRM.png',
	},
};

module.exports = {
	name: 'customize_gm',
	description: 'customize your good morning embed',
	category: 'utility',
	async execute(message, args, IPM) {
		const data = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/goodmorningdata.json');
		if (!data.userDesigns[message.author.id]) {
			data.userDesigns[message.author.id] = defaultEmbed;
		}
		if (args.length) {
			const property = args[0];const value = args[1];
			if (data.userDesigns[message.author.id]) {
				defaultEmbed = data.userDesigns[message.author.id];
			}
			if (exampleEmbed[property]) {
				defaultEmbed[property] = value;
			}
			data.userDesigns[message.author.id] = defaultEmbed;
		}
		if (data.userDesigns[message.author.id]) {
			defaultEmbed = data.userDesigns[message.author.id];
		}
		message.channel.send('your embed:');
		message.channel.send({ embed: defaultEmbed });
		IPM.write_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/goodmorningdata.json', data);
		defaultEmbed = backupEmbed;
	},
};
*/
