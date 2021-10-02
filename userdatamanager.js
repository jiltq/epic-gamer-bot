const fs = require('fs');

/**
	Returns all data from JSON file

	@returns Parsed data
*/
async function getData() {
	const rawdata = fs.readFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/UserData.json', 'utf8');
	return JSON.parse(rawdata);
}
/**
	Writes data to the JSON file

	@param data New data to write
*/
async function setData(data) {
	await validateArgs([data]);
	fs.writeFileSync('C:/Users/Ethan/OneDrive/Desktop/Discord Bots/Epic Gamer Bot/Epic Gamer Bot Main/UserData.json', JSON.stringify(data));
}
/**
	Throws an error if a function lacks important parameters

	@param args Parameters
*/
async function validateArgs(args = []) {
	if (args.length < 1) return;
	for (let i = 0; i < args.length; i++) {
		if (args[i] == null || args[i] == undefined) throw new Error('Required parameter missing!');
	}
}

module.exports = {
	name: 'User Data Manager',
	/**
		Checks if any data for a user exists

		@param id User ID to validate data for
		@return If any data exists for the user
	*/
	async ifDataExists(id) {
		await validateArgs([id]);
		const data = await getData();
		return data.users[id] != null;
	},
	/**
		Adds a user to the database

		@param id User ID of user to add
	*/
	async pushUser(id) {
		await validateArgs([id]);
		if (await module.exports.ifDataExists(id)) return;
		const data = await getData();
		data.users[id] = {};
		await setData(data);
	},
	/**
		Returns all data from a user
		Note: this method of accessing data is not encouraged

		@param id User ID of user to read data from
		@returns User data
	*/
	async readData(id) {
		await validateArgs([id]);
		if (!await module.exports.ifDataExists(id)) await module.exports.pushUser(id);
		const data = await getData();
		return data.users[id];
	},
	/**
		Overwrites user data
		Note: this method of writing data is not encouraged

		@param id User ID of user to write data to
		@param newData New data to overwrite with
	*/
	async writeData(id, newData) {
		await validateArgs([id, newData]);
		if (!await module.exports.ifDataExists(id)) await module.exports.pushUser(id);
		const data = await getData();
		data.users[id] = newData;
		await setData(data);
	},
	/**
		Writes data to a property in user data

		@param id User ID for data to ajust
		@param property Property to write to
		@param newData New data to write
	*/
	async writeProperty(id, property, newData) {
		await validateArgs([id, property, newData]);
		if (!await module.exports.ifDataExists(id)) await module.exports.pushUser(id);
		const data = await getData();
		data.users[id][property] = newData;
		await setData(data);
	},
	/**
		Returns a property from user data
		Note: If data does not exist, it is filled in from a template

		@param id User ID
		@param property Property to search for
		@returns Property
	*/
	async readProperty(id, property) {
		await validateArgs([id, property]);
		if (!await module.exports.ifDataExists(id)) await module.exports.pushUser(id);
		let data = await getData();
		if (data.users[id][property] == null) {
			console.log('reading from template to fill in property');
			console.log(id);
			// Fill in property to avoid errors from undefined properties
			const template = await module.exports.readProperty('Template', property);
			await module.exports.writeProperty(id, property, template);
		}
		data = await getData();
		return data.users[id][property];
	},
	/**
		Returns an array of all user ID's with data

		@returns User ID's with data
	*/
	async getUsers() {
		const data = await getData();
		return Object.keys(data.users);
	},
	/**
		Pushes data to either an object or an array

		@param id User ID
		@param property Property to push data to
		@param newData New data to push
	*/
	async pushData(id, property, newData) {
		await validateArgs([id, property, newData]);
		let data;
		const oldData = await module.exports.readProperty(id, property);
		if (typeof oldData != 'object' || oldData == null) throw new Error('Old data is not an object/array or is null!');
		if (oldData.length == undefined) {
			if (newData.length != undefined) throw new Error('New data is not the same data type as old data!');
			data = {
				...oldData,
				...newData,
			};
		}
		else if (oldData.length != undefined) {
			if (newData.length == undefined) throw new Error('New data is not the same data type as old data!');
			data = [
				...oldData,
				...newData,
			];
		}
		await module.exports.writeProperty(id, property, data);
	},
	/**
		Returns a specific property from every user

		@param property Property to search for
		@param mapToObject Whether or not to return an object instead (Optional)
		@param returnArrayEntries Whether or not to return object entries as an array (Optional)
		@returns An array of the property, or an object mapping properties to their respective users
	*/
	async readProperties(property, mapToObject = false, returnArrayEntries = false) {
		await validateArgs([property]);
		const allData = await getData();
		if (mapToObject) {
			const object = {};
			for (const [key, value] of Object.entries(allData.users)) {
				object[key] = value[property];
			}
			return object;
		}
		else if (!returnArrayEntries && !mapToObject) {
			const array = Object.values(allData.users);
			return array.map(user => user[property]);
		}
		else if (returnArrayEntries) {
			const object = {};
			for (const [key, value] of Object.entries(allData.users)) {
				object[key] = value[property];
			}
			return Object.entries(object);
		}
	},
	async validateArgs(args) {
		await validateArgs(args);
	},
};
