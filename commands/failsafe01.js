/*module.exports = {
	name: 'failsafe01',
	description: 'bans all members, can only be used by jiltq',
	execute(message, args) {
		if (message.author.id == '695662672687005737') {
			message.channel.send('woah there, jiltq! are you absolutely 100% sure you want to execute failsafe01?');
			const filter = m => m.content.includes('yes') && m.author.id == '695662672687005737' || m.content.includes('no') && m.author.id == '695662672687005737';
			const collector = message.channel.createMessageCollector(filter, { time: 15000 });

			collector.on('collect', m => {
				console.log(`Collected ${m.content}`);
				if (m.content == 'yes') {
					message.channel.send('ok buster failsafe01 has been executed, i hope u dont regret doing this lmao');
					message.guild.members.cache.array().forEach(function(item, index) {item.ban({ days: 0, reason: 'failsafe01 has been executed' });});
					collector.stop();
				}
				else if (m.content == 'no') {
					message.channel.send('cancelling');
					collector.stop();
				}
			});
			collector.on('end', collected => {
				console.log(`Collected ${collected.size} items`);
				if (!collected.array().length) {
					message.channel.send('**no response given, cancelling..**');
				}
			});
		}
		else {
			message.reply('woah there! you dont have permission to execute this failsafe. please do something else and dont bother about executing this failsafe');
		}
	},
};
*/
