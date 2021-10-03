const fsp = require('fs').promises;

class Json {
	constructor(file) {
		this.file = file;
	}
	async write(data, options) {
		return await fsp.writeFile(this.file, JSON.stringify(data), options);
	}
	async read(options = 'utf8') {
		return JSON.parse(await fsp.readFile(this.file, options));
	}
}
module.exports = Json;