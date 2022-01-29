const fsp = require('fs/promises');

/**
 * Class for easily working with JSON
 */
class Json {
	static async write(file, data, options) {
		return await fsp.writeFile(file, JSON.stringify(data), options);
	}
	static async read(file, options = 'utf8') {
		return JSON.parse(await fsp.readFile(file, options));
	}
	static formatPath(file) {
		return `${process.cwd()}/JSON/${file}.json`;
	}
}
module.exports = Json;