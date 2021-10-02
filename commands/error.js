module.exports = {
	name: 'error',
	description: 'create a wonderful error',
	async execute(message, args) {
		let errormessage = 'This is an error!';
		if (message.author.id == '695662672687005737') errormessage = args.join(' ');
		throw new Error(errormessage);
	},
};
