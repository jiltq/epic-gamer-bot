const Discord = require('discord.js');
const visuals = require('../visuals.js');
const rules = [
	{
		name: 'Do not organize, participate in, or encourage harassment of others.',
		desc: 'Disagreements happen and are normal, but continuous, repetitive, or severe negative comments may cross the line into harassment and are not okay.',
	},
	{
		name: 'Do not organize, promote, or coordinate servers around hate speech.',
		desc: 'It’s unacceptable to attack a person or a community based on attributes such as their race, ethnicity, national origin, sex, gender, sexual orientation, religious affiliation, or disabilities.',
	},
	{
		name: 'Do not make threats of violence or threaten to harm others.',
		desc: 'This includes indirect threats, as well as sharing or threatening to share someone’s private personal information (also known as doxxing).',
	},
	{
		name: 'Do not evade user blocks or server bans.',
		desc: 'Do not send unwanted, repeated friend requests or messages, especially after they’ve made it clear they don’t want to talk to you anymore. Do not try to hide your identity in an attempt to contact someone who has blocked you, or otherwise circumvent the tools we have which enable users to protect themselves.',
	},
	{
		name: 'Do not send others viruses or malware,',
		desc: 'attempt to phish others, or hack or DDoS them.',
	},
	{
		name: 'You may not sexualize minors in any way.',
		desc: 'This includes sharing content or links which depict minors in a pornographic, sexually suggestive, or violent manner, and includes illustrated or digitally altered pornography that depicts minors (such as lolicon, shotacon, or cub). We report illegal content to the National Center for Missing and Exploited Children.',
	},
	{
		name: 'You may not share sexually explicit content of other people without their consent,',
		desc: 'or share or promote sharing of non-consensual intimate imagery (also known as revenge porn) in an attempt to shame or degrade someone.',
	},
	{
		name: 'You may not share content that glorifies or promotes suicide or self-harm,',
		desc: 'including any encouragement to others to cut themselves, or embrace eating disorders such as anorexia or bulimia.',
	},
	{
		name: 'You may not share images of sadistic gore or animal cruelty.',
		desc: '⠀',
	},
	{
		name: 'You may not use Discord for the organization, promotion, or support of violent extremism.',
		desc: '⠀',
	},
	{
		name: 'You may not promote, distribute, or provide access to content involving the hacking, cracking, or distribution of pirated software or stolen accounts.',
		desc: 'This includes sharing or selling cheats or hacks that may negatively affect others in multiplayer games.',
	},
	{
		name: 'You should not promote, encourage or engage in any illegal behavior.',
		desc: 'This is very likely to get you kicked off Discord, and may get you reported to law enforcement.',
	},
];
const bots = [
	{
		name: 'Epic Gamer Bot',
		help: '?help',
		desc: 'The official server bot - does many things',
	},
	{
		name: 'Dank Memer',
		help: 'pls help',
		desc: 'Meme and economy bot',
	},
	{
		name: 'esmBot',
		help: '@esmBot help',
		desc: 'Image/gif editor',
	},
	{
		name: 'MEE6',
		help: '!help',
		desc: 'Message counter',
	},
	{
		name: 'Octave',
		help: '_help',
		desc: 'Music player',
	},
	{
		name: 'Rythm',
		help: '.help',
		desc: 'Music player II',
	},
];
const serverDesc = 'Epic Gamers is a community created by <@695662672687005737> SOMETHING IDK\n\n';

const functions = {
	quoteland: async function(message) {
		const client = message.client;
		const server = await client.guilds.fetch('810280092013428807');
		const invites = await server.invites.fetch();
		const embed = new Discord.MessageEmbed()
			.setAuthor((await message.guild.members.fetch(server.ownerId)).user.username, (await message.guild.members.fetch(server.ownerId)).user.avatarURL())
			.setTitle(server.name)
			.setDescription(server.description)
			.setURL(invites.first().url)
			.setThumbnail(await server.iconURL());
		return message.channel.send({ embeds: [embed] });
	},
	smp: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Epic Gamers SMP')
			.setDescription('the *amazing* smp for epic gamers\n\nip: **45.43.15.205:25638**')
			.setThumbnail(await message.guild.iconURL());
		return message.channel.send({ embeds: [embed] });
	},
	modform: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Epic Gamers Mod Form')
			.setURL('https://forms.gle/2QewSSUEHp2mNYmF8')
			.setDescription('Application form for Epic Gamers Moderation')
			.setThumbnail('https://www.gstatic.com/images/branding/product/1x/forms_2020q4_48dp.png');
		return message.channel.send({ embeds: [embed] });
	},
	rules: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Epic Gamers Rules')
			.setThumbnail(await message.guild.iconURL());
		for (let i = 0; i < rules.length; i++) {
			if ((i + 1) == 25) break;
			const rule = rules[i];
			embed.addField(`${i + 1}.) ${rule.name}`, rule.desc);
		}
		embed.addField('And of course, you must abide to Discord\'s Community Guidelines and TOS', 'TOS: **https://discord.com/terms**\nCommunity Guidelines: **https://discord.com/guidelines**');
		return message.channel.send({ embeds: [embed] });
	},
	readthis: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Welcome to ${message.guild.name}!`)
			.setThumbnail(await message.guild.iconURL())
			.setDescription(message.guild.description);
		return message.channel.send({ embeds: [embed] });
	},
	eventprompt: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setAuthor('Auto Event System', await message.guild.iconURL())
			.setTitle('Would you like to participate in auto events?')
			.setDescription('Auto events help you connect and play with others who share the same interests as you. Auto events usually occur every week.');
		return message.channel.send({ embeds: [embed] });
	},
	visuals: async function(message) {
		message.channel.send({ embeds: [visuals.embeds.error(module)] });
		message.channel.send({ embeds: [visuals.embeds.warning(module)] });
		message.channel.send({ embeds: [visuals.embeds.success(module)] });
		message.channel.send({ embeds: [visuals.embeds.query(module)] });
		message.channel.send({ embeds: [visuals.embeds.load(module)] });
	},
	serverbots: async function(message) {
		const embed = new Discord.MessageEmbed()
			.setTitle('🤖 Server Bots')
			.setDescription('The server\'s bots and what they do')
			.setThumbnail(await message.guild.iconURL());
		for (let i = 0; i < bots.length; i++) {
			if ((i + 1) == 26) break;
			const bot = bots[i];
			embed.addField(`${bot.name}  |  ${bot.help}`, bot.desc);
		}
		return message.channel.send({ embeds: [embed] });
	},
	otherservers: async function(message) {
		const invites = {
			'774720796844228618':'https://discord.gg/mC2xwKmqJj',
			'738649110311338146':'https://discord.gg/nkSwVgzWny',
			'810280092013428807':'https://discord.gg/X3uaDp8MuQ',
		};
		const servers = [
			await message.client.guilds.fetch('774720796844228618'),
			await message.client.guilds.fetch('738649110311338146'),
			await message.client.guilds.fetch('810280092013428807'),
		];
		servers.forEach(async server =>{
			const embed = new Discord.MessageEmbed()
				.setAuthor((await message.guild.members.fetch(server.ownerId)).user.username, (await message.guild.members.fetch(server.ownerId)).user.avatarURL())
				.setTitle(server.name)
				.setURL(invites[server.id])
				.setDescription(server.description || '')
				.setThumbnail(await server.iconURL() || '');
			message.channel.send({ embeds: [embed] });
		});
	},
	epicgamers: async function(message) {
		const client = message.client;
		const server = await client.guilds.fetch('696079746697527376');
		const invites = await server.invites.fetch();
		const embed = new Discord.MessageEmbed()
			.setAuthor((await message.guild.members.fetch(server.ownerId)).user.username, (await message.guild.members.fetch(server.ownerId)).user.avatarURL())
			.setTitle(server.name)
			.setDescription(server.description)
			.setURL(invites.first().url)
			.setThumbnail(await server.iconURL());
		return message.channel.send({ embeds: [embed] });
	},
};
module.exports = {
	name: 'embedresponse',
	description: 'test for embeds',
	category: 'dev',
	async execute(message, args) {
		await functions[args[0]](message);
	},
};
