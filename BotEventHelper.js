const fsp = require('fs/promises');

class BotEventHelper {
	static async listen({ emitter, path }) {
		const files = (await fsp.readdir(path)).filter(file => file.endsWith('.js'));
		for (const file of files) {
			const event = require(`${path}${file}`);
			if (event.once) {
				emitter.once(event.name, async (...args) => await event.execute(...args));
			}
			else {
				emitter.on(event.name, async (...args) => await event.execute(...args));
			}
		}
	}
}
module.exports = BotEventHelper;