const fs = require('fs');
const fsp = require('fs').promises;
const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config.json');
const visuals = require('./visuals.js');
const jiltq = config.jiltq;
const Commands = require('./commandHelper.js');
const Json = require('./jsonHelper.js');

const commands = new Commands(__dirname + '/commands/');
const cooldowns = new Discord.Collection();
/**
 * The IPM (Internal Process Manager) manages most internal processes sent throughout Epic Gamer Bot.
 * Examples include executing commands, modifying JSON data, etc.
 *
 * Created by jiltq on 12/25/2020
 */
module.exports = {
	name: 'IPM',
	/**
	 * Execute a command
	 * @param {string} $command Name of command
	 * @param {Discord.Message} $message Message
	 * @param {Array} $args Arguments
	 */
	async executeCommand($command, $message, $args) {
		return await commands.execute($command, $message, $args, module.exports);
		const command = commands.get($command) || commands.find(cmd => cmd.aliases && cmd.aliases.includes($command));
		if (!command) return;
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has($message.author.id) && $message.author.id != jiltq) {
			const expirationTime = timestamps.get($message.author.id) + cooldownAmount;
			if (Date.now() < expirationTime) {
				const timeLeft = (expirationTime - Date.now()) / 1000;
				const embed = new Discord.MessageEmbed()
					.setTitle('slow down dude')
					.setDescription(`you gotta wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command`);
				return $message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
			}
		}
		timestamps.set($message.author.id, Date.now());
		setTimeout(() => timestamps.delete($message.author.id), cooldownAmount);
		if (command.permissions && $message.author.id != jiltq) {
			const authorPerms = $message.channel.permissionsFor($message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return $message.reply({ content: 'You can not do this!' });
			}
		}
		if (command.category == 'dev' && $message.author.id != jiltq) {
			return $message.reply({ content: 'You can not do this!' });
		}
		if (command.args && !$args.length) {
			return $message.reply({ content: `try that again but actually provide arguments this time\n\nusage: ${config.prefix}${command.name} ${command.usage}`, allowedMentions: { repliedUser: false } });
		}
		$message.channel.sendTyping();
		visuals.log(module, 'norm', `IPM: User "${$message.author.username}" executed command "${command.name}" with arguments "${$args.join(',')}"`);
		return await command.execute($message, $args, module.exports);
	},
	async return_command_data(command, message, args) {
		if (!commands.has(command)) return;
		return await commands.get(command).internal(message, args);
	},
	/* Internal Commands */
	async execute_internal_command(command, options) {
		const commandFile = require(`./Internal Commands/${command}.js`);
		commandFile.execute(options);
	},
	async return_internal_command_data(command, options) {
		const commandFile = require(`./Internal Commands/${command}.js`);
		commandFile.internal(options);
	},
	/* Databases */
	async return_database_data(database, options) {
		const databaseFile = require(`./databases/${database}.js`);
		return databaseFile.internal(options);
	},
	async send_data(data, directory) {
		fs.writeFileSync(directory + '/data.json', JSON.stringify(data));
	},
	async write_database_data(database, data_name, new_data, shardID) {
		const databaseFile = require(`./databases/${database}.js`);
		databaseFile[shardID][data_name] = new_data;
	},
	/* JSON */
	/**
	 * @deprecated
	 */
	async return_json_data(directory) {
		return module.exports.readJSON(directory);
	},
	/**
	 * Read JSON data
	 * @param {string | Buffer | URL | FileHandle} file filename or FileHandle
	 * @param {Object | string} options optional options
	 * @returns {*} Fulfills with the contents of the file
	 */
	async readJSON(file, options = 'utf8') {
		return await (new Json(file)).read(options);
	},
	/**
	 * Overwrite JSON data
	 * @param {string | Buffer | URL | FileHandle} file filename or FileHandle
	 * @param {string | Buffer | TypedArray | DataView | Object | AsyncIterable | Iterable | Stream} data Data to overwrite with
	 * @param {Object | string} options Optional options
	 * @returns {Promise} Fulfills with undefined upon success
	 */
	async writeJSON(file, data, options) {
		return await (new Json(file)).write(data, options);
	},
	/** Modify a property in JSON data */
	async editJSON(file, key, value, options = 'utf8') {
		console.log(file);
		if (!(await fsp.readFile(file, options)).length) return;
		const data = JSON.parse(await fsp.readFile(file, options));
		data[key] = value;
		return await fsp.writeFile(file, JSON.stringify(data), options);
	},
	/** Add a property to JSON data */
	async push2JSON(file, data, options = 'utf8') {
		let jsondata = JSON.parse(await fsp.readFile(file, options));
		jsondata = {
			...jsondata,
			...data,
		};
		return await fsp.writeFile(file, JSON.stringify(jsondata), options);
	},
	/** Remove a property from JSON data */
	async deleteJSON(file, index, options = { encoding:'utf8' }) {
		const data = JSON.parse(await fsp.readFile(file, options));
		delete data[index];
		return await fsp.writeFile(file, JSON.stringify(data), options);
	},
	/**
	 * @deprecated
	 */
	async edit_json_data(directory, index, value) {
		return module.exports.editJSON(directory, index, value);
	},
	/**
	 * @deprecated
	 */
	async push_data_to_json(directory, data) {
		return module.exports.push2JSON(directory, data);
	},
	/**
	 * @deprecated
	 */
	async write_json_data(directory, data) {
		return module.exports.writeJSON(directory, data);
	},
	async return_json_length(directory) {
		const data = JSON.parse(fs.readFileSync(directory, 'utf8'));
		return Object.keys(data).length;
	},
	/**
	 * @deprecated
	 */
	async delete_json_entry(directory, index) {
		const data = JSON.parse(fs.readFileSync(directory, 'utf8'));
		delete data[`${index}`];
		fs.writeFileSync(directory, JSON.stringify(data));
	},
	async fetch(url, options) {
		return JSON.parse(JSON.stringify(await (await fetch(url, options)).json()));
	},
	async return_commands() {
		return commands;
	},
};
process.on('beforeExit', (code) => {
	console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
	console.log('Process exit event with code: ', code);
});

process.on('uncaughtException', async $error =>{
	visuals.log(module, 'error', $error);
});