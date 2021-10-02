const Discord = require('discord.js');

module.exports = {
	name: 'savecoordinates',
	description: 'save a set of coordinates',
	slash_command_options: [ { 'name':'x', 'description':'x coordinate', 'type':4, 'required':true }, { 'name':'y', 'description':'y coordinate', 'type':4, 'required':true }, { 'name':'z', 'description':'z coordinate', 'type':4, 'required':true }, { 'name':'name', 'description':'name for coordinates', 'type':3, 'required':true }, { 'name':'description', 'description':'description for coordinates', 'type':3, 'required':false }, { 'name':'isPrivate', 'description':'if your coordinates should be private', 'type':5, 'required':false } ],
	async execute(message, args, IPM) {
		const x = args[0];const y = args[1];
		const z = args[2];const name = args[3];
		const description = args[4];let private = args[5];
		if (private.toLowerCase().trim() == 'false') {
			private = false;
		}
		else if (private.toLowerCase().trim() == 'true') {
			private = true;
		}
		const data = { };
		data[name] = { 'x': x, 'y': y, 'z': z, 'user': message.author.id, 'description': description || 'Not Provided', 'private': private || false };
		const oldData = await IPM.return_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json');
		if (oldData[name]) return message.channel.send('there are already coordinates booked for this name!');

		if (!oldData.guilds[message.guild.id]) {
			console.log(`adding guild ${message.guild.id} to json`);
			const guildData = { ...oldData.guilds };
			guildData[message.guild.id] = { ...data };
			IPM.edit_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json', 'guilds', guildData);
		}
		else {
			const oldGlobalGuildData = oldData.guilds;
			const oldGuildData = oldData.guilds[message.guild.id];
			oldGlobalGuildData[message.guild.id] = { ...oldGuildData, ...data };
			IPM.edit_json_data('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json', 'guilds', oldGlobalGuildData);
		}
		const embed = new Discord.MessageEmbed()
			.setTitle('successfully saved coordinates!');
		message.channel.send(embed);
		/*
		IPM.push_data_to_json('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json', data, false)
			.then(async () =>{
				const embed = new Discord.MessageEmbed()
					.setTitle('successfully saved coordinates!');
				message.channel.send(embed);
			})
			.catch(async error =>{
				console.log(error);
			});
		*/
	},
};
