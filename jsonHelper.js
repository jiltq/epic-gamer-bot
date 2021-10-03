const fsp = require('fs').promises;

/**
	 * Gives easier ability to read and write JSON data
 */
class Json {
	/**
	 * Create a new Json class
	 * @param {string} file Path to JSON file
	 */
	constructor(file) {
		this.file = file;
	}
	/**
	 * Write data to JSON
	 * @param {any} data Data to write
	 * @param {Object} options
	 * @returns {Promise} If writing was successful
	 */
	async write(data, options) {
		return await fsp.writeFile(this.file, JSON.stringify(data), options);
	}
	/**
	 * Read JSON data
	 * @param {Object | string} options
	 * @returns {any} JSON data
	 */
	async read(options = 'utf8') {
		return JSON.parse(await fsp.readFile(this.file, options));
	}
}
module.exports = Json;