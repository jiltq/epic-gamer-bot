const Discord = require('discord.js');
const game_data = {};

/*
	Steps coded:


*/
/*
	Reference Guide

	Data
	----
	b: bot-taken move
	u: user-taken move
*/

module.exports = {
	name: 'tictac',
	description: 'play a game of tic-tac-toe',
	category: 'games',
	async execute(message, args) {
		if (!game_data[message.author.id]) game_data[message.author.id] = { 'tr':null, 'tl':null, 'tm':null, 'lm':null, 'm':null, 'rm':null, 'br':null, 'bm':null, 'bl':null };
		if (!game_data[message.author.id].m) {
			game_data[message.author.id].m = 'b';
		}
		let starting = 't'
		let currentstring = 'e'
		for (let [key, value] of Object.entries(game_data[message.author.id])) {
			if (!value) currentstring.concat(':black_medium_square:');
			if (value == 'u') currentstring.concat(':regional_indicator_x:');
			if (value == 'b') currentstring.concat(':blue_circle:');
			if (starting != key.charAt(0)) {
				message.channel.send(currentstring);
				currentstring = 'e';
			}
			starting = key.charAt(0);
		}
		message.channel.send(Object.values(game_data[message.author.id]));
	},
};
