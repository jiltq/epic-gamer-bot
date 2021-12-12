const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const mail = require('nodemailer');
const { email, emailPass } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('email')
		.setDescription('email people via egb')
		.addStringOption(option =>
			option.setName('to')
				.setDescription('the email address to send this email to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('subject')
				.setDescription('subject of email')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('text')
				.setDescription('text to send')
				.setRequired(true)),
	async execute(interaction) {
		const transporter = mail.createTransport({
			service: 'gmail',
			auth: {
				user: email,
				pass: emailPass,
			},
		});
		const mailOptions = {
			from: email,
			to: interaction.options.getString('to'),
			subject: interaction.options.getString('subject'),
			text: interaction.options.getString('text'),
		};
		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			}
			else {
				console.log('Email sent: ' + info.response);
			}
		});
	},
};
