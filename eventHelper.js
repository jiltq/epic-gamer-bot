const fs = require('fs');

class Events {
	constructor(path) {
		this.path = path;
		this.files = fs.readdirSync(path).filter(file => file.endsWith('.js'));
	}
	async listen(client) {
		for (const file of this.files) {
			const event = require(`${this.path}${file}`);
			if (event.once) {
				client.once(event.name, async (...args) => await event.execute(...args));
			}
			else {
				client.on(event.name, async (...args) => await event.execute(...args));
			}
		}
	}
}
module.exports = Events;