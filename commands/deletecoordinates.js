const Discord = require('discord.js');

module.exports = {
	name: 'deletecoordinates',
	description: 'delete saved coordinates',
	async execute(message, args, IPM) {
		const name = args[0];
		await IPM.return_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json').then(async rawdata =>{
			const data = rawdata.guilds[message.guild.id];
			const backup = data[name];
			if (!data[name]) message.reply(`It doesn't seem like this server has coordinates saved as "${name}"`);
			if (data[name].user == message.author.id) {
				delete data[name];
				const globaldata = { ...rawdata.guilds, ...data };
				IPM.edit_json_data('C:/Users/Ethan/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/savedcoordinates.json', 'guilds', globaldata)
					.then(async () =>{
						const embed = new Discord.MessageEmbed()
							.setColor('#007F00')
							.setTitle('successfully deleted coordinates!');
						if (backup.private) {
							embed.setDescription('Incase you change your mind, the coordinates have been sent to you in a DM');
							message.member.send(`Private coordinates for ${name}: **${backup.x}, ${backup.y}, ${backup.z}**`);
						}
						else {
							embed.setDescription(`Incase you change your mind, the coordinates are **${backup.x}, ${backup.y}, ${backup.z}**`);
						}
						message.channel.send(embed);
					});
			}
			else {
				message.reply('You cannot do this!');
			}
		});
	},
};
