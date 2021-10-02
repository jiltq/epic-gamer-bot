const brain = require('brain.js');
const networkPath = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/filterNetwork.json';
const filterPath = 'C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/filterData.json';

module.exports = {
	name: 'test',
	description: 'tests tests tests',
	category: 'dev',
	async execute(message, args, IPM) {
		const data = await IPM.readJSON(filterPath);
		const network = new brain.recurrent.LSTM();
		network.train(data.messages, {
			log: true,
		});
		await IPM.writeJSON(networkPath, network.toJSON());
	},
};
