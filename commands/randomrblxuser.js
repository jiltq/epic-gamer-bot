const querystring = require('querystring');

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = {
	name: 'randomrblxuser',
	description: 'Get a random roblox user',
	args: false,
	async execute(message, args, IPM) {
		const random = Math.floor(Math.random() * 20) + 3;
		const query = makeid(random);
		const querystr = querystring.stringify({ keyword: query });
		let id = await IPM.fetch(`https://users.roblox.com/v1/users/search?${querystr}&limit=10`);
		if (id.data != null) {
			if (id.data.length > 0) {
				id = id.data[0].id;
			}
			else {
				return await module.exports.execute(message, args, IPM);
			}
		}
		else {
			return await module.exports.execute(message, args, IPM);
		}
		return await IPM.return_command_data('rblxuser', message, [id, 'true', IPM]);
	},
};
