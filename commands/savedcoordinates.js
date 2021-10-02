const Discord = require('discord.js');

module.exports = {
	name: 'savedcoordinates',
	description: 'get saved coordinates',
	async execute(message, args, IPM) {
		if (!args.length) {
			await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json').then(async rawdata =>{
				const data = rawdata.guilds[message.guild.id];
				if (!data) return message.channel.send('it doesn\'t look like this server has any coordinates saved!');
				if (!Object.keys(data).length) return message.channel.send('it doesn\'t look like this server has any coordinates saved!');
				// const hide = data.filter(coords => coords.private == true && message.author.id == coords.user);
				// const groups = await GroupHelper.group(Object.keys(data), 3);
				const embed = new Discord.MessageEmbed()
					.setTitle('Saved Coordinates');
				const privateEmbed = new Discord.MessageEmbed()
					.setTitle('Private saved coordinates');
				for (const coordinates in data) {
					const user = await message.guild.members.fetch(data[coordinates].user);
					if (data[coordinates].private && message.author.id == user.id) {
						privateEmbed.addField(coordinates, `${data[coordinates].x}, ${data[coordinates].y}, ${data[coordinates].z}\nDescription: ${data[coordinates].description}\nSaved by: ${user.displayName}`);
					}
					else {
						embed.addField(coordinates, `${data[coordinates].x}, ${data[coordinates].y}, ${data[coordinates].z}\nDescription: ${data[coordinates].description}\nSaved by: ${user.displayName}`);
					}
				}
				if (privateEmbed.fields.length > 0) {
					embed.setDescription('**Notice: Private coordinates saved by you have been sent to you in a DM**');
					message.member.send(privateEmbed);
				}
				message.channel.send(embed);
			});
			return;
		}
		const name = args[0];
		await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json').then(async rawdata =>{
			const data = rawdata.guilds[message.guild.id];
			if (!data) return message.channel.send('it doesn\'t look like this server has any coordinates saved!');
			const coordinates = data[name];
			if (!coordinates) return message.channel.send(`It doesn't look like this server has coordinates saved as "${name}"`);
			const user = await message.guild.members.fetch(coordinates.user);
			const embed = new Discord.MessageEmbed()
				.setTitle(`${name}: ${coordinates.x}, ${coordinates.y}, ${coordinates.z}`)
				.addField('Description', coordinates.description)
				.addField('Saved by', user.displayName);
			message.channel.send(embed);
		});
	},
};
