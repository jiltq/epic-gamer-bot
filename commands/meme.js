const Discord = require('discord.js');
const embedHelper = require('../commandtemplates');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const id = 'cijuAT1NE_QC3xifqZ5Dhw';
const secret = 'UpXZVBlmmPn0e_2Osj2PdTuWti-ioQ';
const username = 'jiltq';
const password = 'XzB3mqG5R7_D_b5';
const postData = `grant_type=password&username=${username}&password=${password}`;

const memes2Get = 100;
module.exports = {
	name: 'meme',
	description: 'Memes from r/memes',
	category: 'fun',
	args: false,
	async execute(message, args, IPM) {
		/*
		const params = new URLSearchParams({
			grant_type: 'password',
			username: username,
			password: password,
		});
		const response = await IPM.fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'POST',
			body: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length,
				'Authorization': 'Basic ' + new Buffer(id + ':' + secret).toString('base64'),
			},
		});
		const token = response.access_token;
		*/
		const posts = await IPM.fetch(`https://www.reddit.com/r/memes/hot.json?limit=${memes2Get}`);
		const index = Math.floor(Math.random() * posts.data.children.filter(child => !child.data.is_self).length);
		const post = posts.data.children.filter(child => !child.data.is_self)[index].data;
		const embed = new Discord.MessageEmbed()
			.setAuthor(post.author)
			.setTitle(post.title)
			.setImage(post.url)
			.setFooter(`👍 ${post.ups}  `);
		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
};
