const chalk = require('chalk');

const themes = {
	default: '#b9bfca',
	error: '#ED4245',
	warn: '#dbab79',
	success: '#0dbc79',
};

module.exports = {
	name: 'log helper',
	log({ name }, theme, message) {
		if (!themes[theme]) return module.exports.log(module.exports, 'error', `theme "${theme}" is not valid!`);
		return console.log(chalk.hex(themes[theme])(`${new Date().toLocaleTimeString('en-US')} | ${name}: ${message}`));
	},
};