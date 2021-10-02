const fetch = require('node-fetch');
// const defaultLocationModule = require('./defaultLocationModule');
const Discord = require('discord.js');
const embedHelper = require('../embedHelper');

const Scraper = require('images-scraper');

const google = new Scraper({
	puppeteer: {
		headless: true,
	},
	tbs: { safe: 'on' },
});

const errorEmbed = new embedHelper.ErrorEmbed(Discord);

async function emojiIcon(desc) {
	/*
		Order of importance:

		Thunderstorm
		Snow
		Rain & Sunny
		Rain
		Partly Cloudy
		Sunny
		Mostly Clear
	*/
	if (desc.search('Thunderstorm') != -1) return '⛈️';
	else if (desc.search('Showers') != -1 && desc.search('Sunny') != -1) return '🌦️';
	else if (desc.search('Showers') != -1) return '🌧️';
	else if (desc.search('Partly Cloudy') != -1) return '⛅';
	else if (desc.search('Sunny') != -1) return '☀️';
	else if (desc.search('Mostly Clear') != -1) return '🌙';
}
async function e(args, message, IPM) {
	const args2 = args.join(',');
	const settings = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/settings.json');

	/* Initial checks */
	/*
	if ((await fetch('https://api.weather.gov')).status != 'OK') {
		const embed = new Discord.MessageEmbed()
			.setColor('#7F0000')
			.setAuthor('the API is currently down')
			.setFooter('please try again later');
		//return message.channel.send(embed);
	}
	*/
	/* Find the forecast for given coordinates */
	const raw_1 = await IPM.fetch(`https://api.weather.gov/points/${args2}`);
	if (raw_1.properties == null) {
		const embed = await errorEmbed.create(raw_1.title, raw_1.detail);
		return message.channel.send({embeds: [embed]});
	}
	const forecast = JSON.parse(JSON.stringify(await (await fetch(JSON.parse(JSON.stringify(await (await fetch(`https://api.weather.gov/points/${args2}`)).json())).properties.forecast)).json())).properties.periods;
	const result = await google.scrape(`${raw_1.properties.relativeLocation.properties.city}, ${raw_1.properties.relativeLocation.properties.state}`, 1);
	const embed = new Discord.MessageEmbed()
		.setTitle(`Weather forecast for ${raw_1.properties.relativeLocation.properties.city}, ${raw_1.properties.relativeLocation.properties.state}`)
		.setImage(result[0].url)
		.setFooter('powered by api.weather.gov & images-scraper');
	let i;
	for (i = 0; i < settings.forecast_periods; i++) {
		embed.addField(`${forecast[i].name} ${await emojiIcon(forecast[i].shortForecast)}`, forecast[i]['detailedForecast']);
	}
	const coords = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/coordinates.json');
	if (!coords.coordinates[`${raw_1.properties.relativeLocation.properties.city}, ${raw_1.properties.relativeLocation.properties.state}`]) {
		coords.coordinates[`${raw_1.properties.relativeLocation.properties.city}, ${raw_1.properties.relativeLocation.properties.state}`] = args.join(',');
	}
	await IPM.write_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/coordinates.json', coords);
	return message.channel.send({embeds: [embed]});
}

module.exports = {
	name: 'forecast',
	description: 'the weather forecast',
	category: 'weather',
	args: true,
	async execute(message, args, IPM) {
		const coords = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/JSON/coordinates.json');
		if (coords.coordinates[args.join(', ')]) {
			e(coords.coordinates[args.join(', ')].split(','), message, IPM);
		}
		else if (!isNaN(args[0]) && !isNaN(args[1])) {
			e(args, message, IPM);
		}
		else {
			return message.channel.send('There aren\'t any places currently available with that name 🤔\nUse `?forecastcoords` to see all available cities');
		}
		// const defaultLocation = defaultLocationModule.defaultLocation(message.author.id)
		// console.log(defaultLocation)
		/*
		if (args = null) {
			if (defaultLocation = null) {
				return message.reply(`i dont have a default location saved for you! if you would like to set your default location, use command '?defaultlocation' ; otherwise, give a set of coordinates`);
			}
		} else if (args = null) {
			if (defaultLocation != null) {
				forecast(defaultLocation.split(','), message);
			}
		} else if (args != null) {
			if (defaultLocation = null) {
				forecast(args,message)
			}
		}
		*/
	},
};
