const fetch = require('node-fetch');
// const defaultLocationModule = require('./defaultLocationModule');
const Discord = require('discord.js');
const embedHelper = require('../embedHelper');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../webHelper.js');
const web = new Web();

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
		return message.channel.send({ embeds: [embed] });
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
	return message.channel.send({ embeds: [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('get the weather of a location')
		.addIntegerOption(option =>
			option
				.setName('latitude')
				.setDescription('latitude of location')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('longitude')
				.setDescription('longitude of location')
				.setRequired(true),
		),
	async execute(interaction) {
		await interaction.deferReply();
		const result = await web.fetch(`https://weather.cc.api.here.com/weather/1.0/report.json?product=observation&name=Berlin-Tegel`, {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + 'RohEThL5yZWKvPwoZZr3Wmu-egaZfyD_BN9HvUnKvrE' },
		});
		console.log(result);
		const points = await web.fetch(`https://api.weather.gov/points/${interaction.options.getInteger('latitude')},${interaction.options.getInteger('longitude')}`);
		const forecasts = (await web.fetch(points.properties.forecast)).properties.periods;
		const embed = new Discord.MessageEmbed()
			.setTitle(`weather for ${points.properties.relativeLocation.properties.city}, ${points.properties.relativeLocation.properties.state}`);
		for (let i = 0; i < 2; i++) {
			const forecast = forecasts[i];
			embed.addField(forecast.name, forecast.detailedForecast);
		}
		await interaction.editReply({ embeds: [embed] });
	},
};
