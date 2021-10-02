const Discord = require('discord.js');
const Scraper = require('images-scraper');
const pageHelper = require('../pageHelper');

// const filterModule = require('../chat-filter-module');
// const wordsToFilter = filterModule.return_filtered_command_words();

let safe = true;

const cache = { };

async function reactions(message, oldmsguser, args) {
	const oldEmbd = message.embeds[0];
	console.log('awaiting');
	let index = 0;
	let displayIndex = 1;
	let max = 1;
	// 4294967295
	const nextFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === oldmsguser.id;
	const nextCollector = message.createReactionCollector(nextFilter, { time: 600000 });

	const backFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === oldmsguser.id;
	const backCollector = message.createReactionCollector(backFilter, { time: 600000 });

	nextCollector.on('collect', async r =>{
		index = index + 1;
		displayIndex = displayIndex + 1;
		if (displayIndex > max) max = displayIndex;
		if (!cache[args.join(' ')][index]) {
			const nextImg = await module.exports.internal(args, index);
			cache[args.join(' ')][index] = nextImg;
			oldEmbd.setImage(nextImg.url);
		}
		else {
			oldEmbd.setImage(cache[args.join(' ')][index].url);
		}
		oldEmbd.setDescription(`**Image ${displayIndex}/${max}**`);
		oldEmbd.setAuthor(cache[args.join(' ')][index].description || args.join(' '), '', cache[args.join(' ')][index].source);
		message.edit('', { embed:oldEmbd });
		message.reactions.removeAll();
		message.react('◀️');
		message.react('▶️');
		console.log(`Collected ${r.emoji.name}`);
	});
	nextCollector.on('end', collected => console.log(`Collected ${collected.size} items`));

	backCollector.on('collect', async r =>{
		if (index != 0) {
			index = index - 1;
			displayIndex = displayIndex - 1;
			if (!cache[args.join(' ')][index]) {
				const backImg = await module.exports.internal(args, index);
				cache[args.join(' ')][index] = backImg;
				oldEmbd.setImage(backImg.url);
			}
			else {
				oldEmbd.setImage(cache[args.join(' ')][index].url);
			}
			oldEmbd.setDescription(`**Image ${displayIndex}/${max}**`);
			oldEmbd.setAuthor(cache[args.join(' ')][index].description || args.join(' '), '', cache[args.join(' ')][index].source);
			message.edit('', { embed:oldEmbd });
			message.reactions.removeAll();
			message.react('◀️');
			message.react('▶️');
			console.log(`Collected ${r.emoji.name}`);
		}
	});
	backCollector.on('end', collected => console.log(`Collected ${collected.size} items`));
}

module.exports = {
	name: 'gimage',
	description: 'search for an image!',
	category: 'fun',
	args: true,
	credit: 'powered by images-scraper | www.npmjs.com/package/images-scraper',
	async execute(message, args, IPM) {
		return;
		if (message.channel.nsfw) safe = false;
		const google = new Scraper({
			puppeteer: {
				headless: true,
			},
			tbs: { safe: safe },
		});
		/*
		var rawMessage = message.content;
		var splitMessage = rawMessage.split(' ');
		var joinedMessage = splitMessage.join('');
		var splitMessageTwo = joinedMessage.split('.');
		var joinedMessageTwo = splitMessageTwo.join('');
		var replacedMessage = joinedMessageTwo.replace(/[^A-Za-z]/g, "")
		var nonRepeatedMessage = replacedMessage.toLowerCase().replace(/(.)(?=.*\1)/g, "");
		let continue_cycle = true;
		let filtered = false;
		wordsToFilter.forEach(filterMessage);

		function filterMessage(item, index) {
			if (!continue_cycle) return;
			var re = new RegExp(item, 'gi');
			var res = nonRepeatedMessage.match(re);
			if (res !== null) {
				const embed = new Discord.MessageEmbed()
					.setColor('#7F0000')
					.setAuthor('your arguments contain inappropiate content!')
					.setFooter('please remove any inappropiate search terms');
				message.channel.send(embed);
				continue_cycle = false;
				filtered = true;
			}
		}
		if (filtered) return;
		*/
		await google.scrape(args.join(' '), 1)
			.then(result =>{
				if (!result.length) {
					const embed = new Discord.MessageEmbed()
						.setAuthor('no results found! :(')
						.setFooter('powered by images-scraper\nlicense:\nhttps://www.npmjs.com/package/images-scraper#license');
					return message.channel.send(embed);
				}
				const embed = new Discord.MessageEmbed()
					.setDescription('**Image 1/1**')
					.setImage(result[0]['url'])
					.setFooter('powered by images-scraper\nlicense:\nhttps://www.npmjs.com/package/images-scraper#license');
				if (safe) {
					embed.setAuthor(result[0].description || args.join(' '), '', result[0]['source']);
				}
				else {
					embed.setAuthor(result[0].description || `${args.join(' ')} NSFW`, '', result[0]['source']);
				}
				cache[args.join(' ')] = { };
				cache[args.join(' ')][0] = result[0];
				message.channel.send({embeds:[embed]}).then(async newMessage =>{
					newMessage.reactions.removeAll();
					newMessage.react('◀️');
					newMessage.react('▶️');
					await reactions(newMessage, message.author, args);
				});
			})
			.catch(err => IPM.execute_internal_command('commanderror', { error: err, message: message }));
	},
	async internal(args, index) {
		const google = new Scraper({
			puppeteer: {
				headless: true,
			},
			tbs: { safe: safe },
		});
		const result = await google.scrape(args.join(' '), (index + 1));
		if (!result.length) return;
		return result[index];
	},
};
