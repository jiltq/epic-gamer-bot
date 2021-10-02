const Discord = require('discord.js');
const fs = require('fs');
var name = null;


module.exports = {
	name: 'createcommand',
	description: 'create a new command!',
	execute(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle('what would you like your command to be named?')
			.setDescription('**do __not__ use the following characters: ` \'**');
		message.channel.send(embed);
		const filter = m => m.author.id == message.author.id;
		const collector = message.channel.createMessageCollector(filter, { time: 15000 });

		collector.on('collect', m => {
			console.log(`Collected ${m.content}`);
			name = m.content;
			message.channel.send(`ok, making new command with name '${name}'..`);
			collector.stop();
			const test = `const Discord = require('discord.js');\nmodule.exports = {\n\tname: '${name}',\n\tcustom: true,\n\texecute(message) {\n\t\tmessage.channel.send('tadah!');\n\t},\n};`;
			fs.writeFileSync(`./commands/custom commands/${name}.js`, test);
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});
	},
};
