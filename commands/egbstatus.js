const Discord = require('discord.js');

module.exports = {
	name: 'egbstatus',
	description: 'Ping',
	usage: '[activity name, type, status]',
	args: true,
	async execute(message, args, IPM) {
		const client = message.client;
		const newactivity = args[0] || 'status';const newtype = args[1] || 'PLAYING';
		const newstatus = args[2] || 'dnd';
		client.user.setPresence({ activity: { name: `${newactivity} | ?help`, type: newtype.toUpperCase() }, status: newstatus.toLowerCase() })
			.then(async () =>{
				const embed = new Discord.MessageEmbed()
					.setColor('#007F00')
					.setTitle('successfully updated status!');
				message.channel.send(embed);
			})
			.catch(async error =>{
				IPM.execute_internal_command('commanderror', { 'client': client, 'error': error, 'message': message, 'additionalInfo': 'Epic Gamer Bot could not handle the drip you provided for him' });
				console.log(error);
			});
	},
};
