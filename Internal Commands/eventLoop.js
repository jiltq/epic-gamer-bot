const eventManager = require('../eventManager.js');
const visuals = require('../visuals.js');

const Mil2Min = 60000;
const Mil2Hr = Mil2Min * 60;
const Mil2Day = Mil2Hr * 24;


const _optimalMsgsPerHr = 30;
const _interval = Mil2Min * 2;
const _channelID = '816126601184018472';
const _msgs = 100;
let processingEvent = false;

async function dothething($client) {
	const IPM = require('../IPM.js');
	const gamedata = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/eventData.json');
	$client.channels.fetch(_channelID).then(async channel =>{
		if (processingEvent) return;
		if (Date.now() >= gamedata.nextTime) {
			processingEvent = true;
			const messages = await channel.messages.fetch({ limit: _msgs });
			const last = messages.last();
			const timePassed = Date.now() - last.createdAt.getTime();
			const avg = _msgs / timePassed;
			const percent = avg / (_optimalMsgsPerHr / Mil2Hr);
			const time = gamedata.cooldown * percent;
			console.log(`Average: ${(avg / Mil2Hr).toFixed(2)} msgs/hr`);
			console.log(`Percent: ${(percent * 100).toFixed(2)}%`);
			console.log(`Time: ${(time / Mil2Day).toFixed(2)} days`);
			gamedata.nextTime = Date.now() + time;
			await eventManager.announceEvent($client)
				.then(async () =>{
					processingEvent = false;
					visuals.log(module, 'success', 'Successfully announced event!');
				})
				.catch(async error =>{
					visuals.log(module, 'error', 'Failed to announce event!');
					console.log(error);
				});
		}
		else if ((gamedata.nextTime - Date.now()) > gamedata.cooldown) {
			const messages = await channel.messages.fetch({ limit: _msgs });
			const last = messages.last();
			const timePassed = Date.now() - last.createdAt.getTime();
			const avg = _msgs / timePassed;
			const percent = avg / (_optimalMsgsPerHr / Mil2Hr);
			const time = gamedata.cooldown * percent;
			gamedata.nextTime = Date.now() + time;
			console.log(`Event Loop: ${(percent * 100).toFixed(2)} of goal met (${(avg / Mil2Hr).toFixed(2)}msgs/hr)`);
		}
		visuals.log(module, 'norm', `Event Loop: ${((gamedata.nextTime - Date.now()) / Mil2Day).toFixed(4)} days left until next event`);
		return await IPM.write_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/eventData.json', gamedata);
	});
}

module.exports = {
	name: 'EventLoop',
	async execute(client) {
		return;
		if (client.shardID != 1) return;
		await dothething(client);
		setInterval(async function() {await dothething(client);}, _interval);
	},
};