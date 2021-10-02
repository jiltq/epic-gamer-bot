const phrases = [
	'i think so',
	`i'm 99${Math.random().toString().slice(1)}% sure`,
	'probably',
	'sure',
	'why not',
	'yep',
	'maybe',
	'there is a possibility',
	'yeah',
	'yes',
	'totally',
	'what do you think?',
	'hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm yeah',
	'true',
	'!false',
	'idk man',
	'no',
	'hmmm',
	'undefined',
];

module.exports = {
	name: 'isegbonline',
	description: 'this command is so stupid lol',
	category: 'fun',
	args: false,
	async execute(message) {
		return message.channel.send(phrases[Math.floor(Math.random() * phrases.length)]);
	},
};
