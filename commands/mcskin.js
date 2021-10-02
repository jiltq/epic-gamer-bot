module.exports = {
	name: 'mcskin',
	description: 'Get the skin of a Minecraft user',
	usage: '[player username]',
	category: 'fun',
	args: true,
	async execute(message, args, IPM) {
		const username = args[0];
		const { id } = await IPM.fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
		if (!id) return;
		const response = await IPM.fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${id}`);
		const raw = response.properties[0].value;
		const buff = Buffer.from(raw, 'base64');
		const text = buff.toString('utf-8');
		const decodedjson = JSON.parse(text);
		const skinurl = decodedjson.textures.SKIN.url;
		return message.channel.send(skinurl);
	},
};
