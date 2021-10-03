module.exports = {
	name: 'autoeventlog',
	internal: true,
	async execute(options) {
		const activity = options.activity;
		const game = options.game;
		const IPM = options.IPM;
		const data = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/games.json');
		if (!data.games.includes(game)) {
			data.games.push(game);
			console.log(game);
		}
		IPM.write_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/games.json', data);
	},
};
