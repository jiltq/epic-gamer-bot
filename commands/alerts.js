const fetch = require('node-fetch');
const Discord = require('discord.js');
async function alerts(args,message) {
	const argsOne = args[0]
	const argsTwo = args[1]

	const response = await fetch(`https://api.weather.gov/alerts/active?point=${argsOne}%2C${argsTwo}`)
	const myJson = await response.json(); //extract JSON from the http response
	var e = JSON.stringify(myJson);
	var a = JSON.parse(e);
	var one = a['features']

	if (one == null) {
		message.channel.send(`**something went wrong with requesting active alerts for this location :(**`);
		return message.channel.send(`**status code:** ${('`'.concat(a["status"],'`')).toLowerCase()} **details:** ${('`'.concat(a["detail"],'`')).toLowerCase()} `);
	}

	if (one[0] == null) {
		return message.channel.send(`**there arent any active alerts for this location**`);
	}

	const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
	one.forEach(myFunction);

function myFunction(item, index) {
  var three = item["properties"]
	var four = three["headline"]
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor('#a88f7e')
		.setTitle(trim(three["headline"], 256))
		.setDescription(`${('`'.concat((trim(three["description"],1022)),'`')).toLowerCase()}`)
		.setThumbnail('https://cdn.discordapp.com/avatars/695662672687005737/f6bcfabe81e1d7a8570c414a5f354a4b.png?size=128')
		.setFooter('powered by: the national weather service api');

	return message.channel.send(exampleEmbed);
}
}

module.exports = {
	name: 'alerts',
	description: 'active alerts',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send('you need to enter in coordinates xd');
		}
		var e = args.join('')
		var rawArgs = e.split(',')
		alerts(rawArgs,message)
	},
};
