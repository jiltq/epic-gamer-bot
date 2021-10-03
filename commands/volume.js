return;
const dispatcherModule = require('../databases/dispatcher');

module.exports = {
	name: 'volume',
	description: 'Ajust the volume of the currently playing audio',
	category: 'music',
	usage: '[volume]',
	args: true,
	async execute(message, args) {
		const min = 0;
		let max = 3;
		if (isNaN(parseFloat(args))) return message.react('❌');
		let volume = parseFloat(args);
		if (message.member.hasPermission('ADMINISTRATOR')) max = (max * 2);
		if (parseFloat(args) > max) {
			volume = max;
		}
		else if (parseFloat(args) < min) {
			volume = min;
		}
		message.react('✅');
		const dispatcher = dispatcherModule.get();
		dispatcher.setVolume(volume);
		return;
	},
};
