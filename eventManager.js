const utility = require('./utility.js');
const Discord = require('discord.js');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const fs = require('fs');
const getColors = require('get-image-colors');
const config = require('./config.json');

const channelID = '861029259321278484';

let processImage = true;
let playerList = '';

module.exports = {
	async addGame(gameId) {
		const IPM = require('./IPM.js');
		const gamedata = await IPM.return_json_data(__dirname + '/JSON/eventData.json');
		if (gamedata.games.find(item => item.id == gameId)) return;
		console.log(`Event Manager: Adding ${gameId}..`);
		gamedata.games.push({
			'id': gameId,
			'customEvents': [],
			'players': [],
		});
		return await IPM.write_json_data(__dirname + '/JSON/eventData.json', gamedata);
	},
	async addPlayer(playerId, gameId) {
		const IPM = require('./IPM.js');
		let gamedata = await IPM.return_json_data(__dirname + '/JSON/eventData.json');
		if (gamedata.games.find(item => item.players.includes(playerId) && item.id == gameId)) return;
		console.log(`Event Manager: Adding player ${playerId} to ${gameId}..`);
		if (!gamedata.games.find(item => item.id == gameId)) {
			await module.exports.addGame(gameId);
			gamedata = await IPM.return_json_data(__dirname + '/JSON/eventData.json');
		}
		gamedata.games[gamedata.games.indexOf(gamedata.games.find(item => item.id == gameId))].players.push(playerId);
		return await IPM.write_json_data(__dirname + '/JSON/eventData.json', gamedata);
	},
	async announceEvent(client) {
		const IPM = require('./IPM.js');
		const gamedata = await IPM.return_json_data(__dirname + '/JSON/eventData.json');
		const index = utility.randomNumber(1, gamedata.games.filter(gam => gam.players.length >= gamedata.maxPlayers).length);
		const game = gamedata.games.filter(gam => gam.players.length >= gamedata.maxPlayers)[index - 1];
		if (!game) throw new Error('No games have enough players!');
		const situationIndex = utility.randomNumber(1, game.customEvents.length);
		const sit = game.customEvents[situationIndex - 1];
		const situation = sit != undefined ? `**${sit}**` : '';
		const players = game.players;
		let text = '||';
		const server = await client.guilds.fetch('696079746697527376');
		players.forEach(async (id, playerindex) =>{
			const member = await server.members.fetch(id);
			text = text.concat(`<@${id}>`);
			if (playerindex < (gamedata.maxPlayers - 1)) {
				playerList = playerList.concat(` ${member.user.username},`);
			}
			else if (playerindex == (gamedata.maxPlayers - 1)) {
				playerList = playerList.concat(` ${member.user.username}.. and ${players.length - gamedata.maxPlayers} others`);
			}
			if (playerindex == (players.length - 1)) {
				text = text.concat('||');
			}
		});
		const gameinfo = await IPM.fetch(`https://store.steampowered.com/api/appdetails?appids=${game.id}`);
		const image = gameinfo[game.id].data.screenshots[0].path_thumbnail;
		fs.writeFileSync(__dirname + '/eventimage.png', '');
		fs.unlinkSync(__dirname + '/eventimage.png');
		const downloadArgs = `-i  ${image}  ${__dirname + '/eventimage.png'}`;
		await execFile('ffmpeg', downloadArgs.split('  '))
			.catch(async () =>{
				processImage = false;
			});
		let colors, color = '';
		if (processImage) {
			colors = await getColors(__dirname + '/eventimage.png');
			color = colors.map(clr => clr.hex())[0];
		}
		const embed = new Discord.MessageEmbed()
			.setAuthor('Auto Event System', await server.iconURL())
			.setTitle(gameinfo[game.id].data.name)
			.setURL(`https://store.steampowered.com/app/${game.id}`)
			.setDescription(situation)
			.setColor(color)
			.setImage(image)
			.setTimestamp()
			.setFooter(`Players:${playerList}`);
		return client.channels.fetch(channelID).then(async channel =>{
			channel.send({ content: text, embeds: [embed] });
			playerList = '';
			processImage = true;
		});
	},
	async registerSteamGames(memberId, profileURL) {
		const IPM = require('./IPM.js');
		const steamKey = config.steamKey;
		const steamId = profileURL.slice(0, -1).substring(profileURL.slice(0, -1).lastIndexOf('/') + 1);
		let games = (await IPM.fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamKey}&steamid=${steamId}&format=json`)).response.games;
		games = games.sort(async function(gamea, gameb) {
			return gameb.playtime_forever - gamea.playtime_forever;
		});
		console.log(games);
		games.forEach(async (game, index) =>{
			console.log(index / (games.length - 1));
			setTimeout(async function() {
				await module.exports.addPlayer(memberId, game.appid.toString());
			}, 1000);
		});
	},
};