const chalk = require('chalk');
const discord = require('discord.js');

const _themes = {
	norm: '#b9bfca',
	error: '#e88388',
	warning: '#dbab79',
	success: '#0dbc79',
	query: '#7289da',
	load: '#2c2f33',
};

function createEmbed(options) {
	return new discord.MessageEmbed(options);
}

module.exports = {
	name: 'Visuals',
	chalkify: function($theme) {
		return chalk.hex(_themes[$theme]);
	},
	log: ({ exports: { name } }, $theme, $message) => console.log(module.exports.chalkify($theme)(`${name}: ${$message}`)),
	embeds: {
		error: function({ exports: { name } }, $error = { name:'Error', message:'This is an error!' }) {
			return createEmbed({
				author: { name: name },
				color: _themes.error,
				title: $error.name,
				description: $error.message,
			});
		},
		warning: function({ exports: { name } }, $warning = 'Warning!') {
			return createEmbed({
				author: { name: name },
				color: _themes.warning,
				title: $warning,
			});
		},
		success: function({ exports: { name } }, $success = 'Success!') {
			return createEmbed({
				author: { name: name },
				color: _themes.success,
				title: $success,
			});
		},
		query: function({ exports: { name } }, $query = 'What?') {
			return createEmbed({
				author: { name: name },
				color: _themes.query,
				title: $query,
			});
		},
		load: function({ exports: { name } }, $load = 'Loading..') {
			return createEmbed({
				author: { name: name },
				color: _themes.load,
				thumbnail: { url: 'https://media1.tenor.com/images/8b8465f7e433e2feb7466ccd60aa75c0/tenor.gif' },
				title: $load,
			});
		},
	},
};