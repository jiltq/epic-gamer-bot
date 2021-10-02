const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const IPM = require('./IPM.js');
const visuals = require('./visuals.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
const _intents = [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES];

module.exports = {
	name: 'Bot File',
};
const Commands = require('./commandHelper.js');
const commands = new Commands(__dirname + '/commands/');

const client = new Discord.Client({ intents: _intents, partials: ['GUILD_MEMBER', 'USER', 'MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
client.internalCommands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const cooldowns = client.cooldowns;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const internalCommandFiles = fs.readdirSync('./Internal Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
for (const file of internalCommandFiles) {
	const internalCommand = require(`./Internal Commands/${file}`);
	client.internalCommands.set(internalCommand.name, internalCommand);
}
client.on('shardDisconnect', ($event, $id) =>{
	visuals.log(module, 'error', `Shard ${$id} disconnected`);
	visuals.log(module, 'error', `Code ${$event.code} -- ${$event.reason}`);
});
client.on('shardError', ($error, $shardId) =>{
	visuals.log(module, 'error', `Shard ${$shardId} encountered a connection error  ||  ${$error.message}`);
});
client.on('shardReady', $id =>{
	visuals.log(module, 'success', `Shard ${$id} is now ready`);
});
client.once('shardReady', async $id =>{
	client.shardID = $id;
	client.internalCommands.get('startup').execute(client);
});
client.on('shardReconnecting', $id =>{
	visuals.log(module, 'warning', `Shard ${$id} is attempting to reconnect or re-identify`);
});
client.on('messageCreate', async message => {
	if (config.maintenance && message.author.id != config.jiltq) {
		return message.reply({ content: 'epic gamer bot is currently undergoing maintenance, so users may not use any of its features.' });
	}
	const { command, args } = await commands.parse(message);
	await commands.cooldown(command, message);
	return await command.execute(message, args, IPM);
});

client.on('messageCreate', async $message =>{
	if (!$message.author.bot && $message.channel.type == 'GUILD_TEXT') {
		await $message.client.shard.broadcastEval(async (c, { message, author, $guildName, color, channelName }) => {
			const $Discord = require('discord.js');
			const channel = await c.channels.fetch('892599884107087892');
			const embed = new $Discord.MessageEmbed()
				.setAuthor(`${author.name} - ${$guildName} #${channelName}`, author.avatar)
				.setColor(color)
				.setFooter('This message was archived automatically')
				.setTimestamp();
			if (message.content.split('\n')[0].length > 256) {
				embed.setDescription(message.content);
			}
			else {
				embed.setTitle(message.content.split('\n')[0]);
				embed.setDescription(message.content.slice(message.content.split('\n')[0].length || 0));
			}
			return channel.send({ embeds: [embed] });
		}, { shard: 0, context: { message: $message, author: {
			name: $message.author.username,
			avatar: $message.author.avatarURL(),
		}, $guildName: $message.guild.name, color: $message.member.displayHexColor || 'RANDOM', channelName: $message.channel.name, 'trim': trim } });
	}
	if (!$message.author.bot && $message.channel.type == 'DM') {
		const message = await $message.fetch();
		if (!cooldowns.has('joe')) {
			cooldowns.set('joe', new Discord.Collection());
		}

		const timestamps = cooldowns.get('joe');
		const cooldownAmount = 100;

		if (timestamps.has($message.author.id)) {
			const expirationTime = timestamps.get($message.author.id) + cooldownAmount;
			if (Date.now() < expirationTime) {
				return message.react('🕒');
			}
		}
		timestamps.set(message.author.id, Date.now());
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		await message.client.shard.broadcastEval(async (c, { Message, author }) => {
			const $Discord = require('discord.js');
			const guild = await c.guilds.fetch('696079746697527376');
			const role = await guild.roles.fetch('893577070964252782');
			if (role.members.has(author.id)) {
				await (role.members.filter(member => member.id != author.id)).forEach(async member =>{
					const embed = new $Discord.MessageEmbed()
						.setAuthor(author.name, author.avatar)
						.setColor('RANDOM')
						.setFooter('send me a message to respond!')
						.setTimestamp();
					if (Message.content.split('\n')[0].length > 256) {
						embed.setDescription(Message.content);
					}
					else {
						embed.setTitle(Message.content.split('\n')[0]);
						embed.setDescription(Message.content.slice(Message.content.split('\n')[0].length || 0));
					}
					await member.send({ embeds: [embed] });
				});
				return true;
			}
			else {
				return false;
			}
		}, { shard: 1, context: { Message: message, author: {
			name: message.author.username,
			avatar: message.author.avatarURL(),
			id: message.author.id,
		} } })
			.then(async (result) => result ? message.react('✅') : message.react('❌'));
	}
});
client.on('rateLimit', (rateLimitInfo) =>{
	client.internalCommands.get('ratelimit').execute(client, rateLimitInfo);
});
client.on('guildMemberAdd', (member) =>{
	IPM.execute_internal_command('verification', { 'client': client, 'member': member });
});
client.on('guildMemberRemove', async member =>{
	console.log(`oh no ${member.displayName} left ${member.guild.name} :((`);
});
client.login(config.token)
	.catch($error=>{
		visuals.log(module, 'error', 'Failed to log in!');
		visuals.log(module, 'error', $error.message);
	});
