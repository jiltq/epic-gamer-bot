/*
const Discord = require('discord.js');
const { Player } = require('discord-player');
const clientModule = require('../databases/client');

module.exports = {
	name: 'playnew',
	description: 'Play a YouTube video',
	usage: '[video name]',
	async execute(message, args) {
    const client = clientModule.get();

    const player = new Player(client);
    client.player = player;
    client.player.on('trackStart', (message, track) =>{
      const embed = new Discord.MessageEmbed()
        .setAuthor('now playing..')
        .setTitle(`**${track.title}**`)
        .setDescription(`**by ${track.author.name}**`)
        .setImage(track.thumbnail);
      message.channel.send(embed);
    })
    client.player.on('searchResults', (message, query, tracks) => {

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Here are your search results for ${query}!`)
    .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
    .setFooter('Send the number of the song you want to play!')
    message.channel.send(embed);

})
client.player.on('error', (error, message) => {
    switch(error){
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!')
            break;
        case 'NotConnected':
            message.channel.send('You are not connected in any voice channel!')
            break;
        case 'UnableToJoin':
            message.channel.send('I am not able to join your voice channel, please check my permissions!')
            break;
        default:
            message.channel.send(`Something went wrong... Error: ${error}`)
    }
});
client.player.setFilters(message, {
			bassboost: true,
			'8D': true
});
		const voiceChannel = message.member.voice.channel;
		voiceChannel.join().then(async connection => {
      console.log('e')
			client.player.play(message, args.join(' '), message.member.user)
		});
	},
};
*/
