const { isMainThread, workerData, parentPort } = require('worker_threads');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const Jimp = require('jimp');
const fsp = require('fs').promises;
const fs = require('fs');
const Discord = require('discord.js');

const editFolder = `${process.cwd()}/editFiles/`;

const _getAllFilesFromFolder = function(dir) {
	let results = [];
	fs.readdirSync(dir).forEach(function(file) {
		file = dir + '/' + file;
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			results = results.concat(_getAllFilesFromFolder(file));
		}
		else {
			results.push(file);
		}
	});
	return results;
};

async function loopFunction(funct, id, args) {
	const frames = _getAllFilesFromFolder(editFolder).filter(file => file.includes(id));
	for (const frame of frames) {
		await funct({ image: frame, id: id, args: args });
	}
}

const functions = {
	caption: async function({ image, args }) {
		const jimpImage = await Jimp.read(image);
		const borderFont = await Jimp.loadFont((jimpImage.bitmap.width - ((64 / 2) * args.text.length)) > 50 ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_32_WHITE);
		const width = Jimp.measureText(borderFont, args.text);
		const shift = 2;
		jimpImage.print(borderFont, (jimpImage.bitmap.width / 2) - (width / 2) - shift, jimpImage.bitmap.height / 25, args.text);
		jimpImage.print(borderFont, (jimpImage.bitmap.width / 2) - (width / 2) + shift, jimpImage.bitmap.height / 25, args.text);
		jimpImage.print(borderFont, (jimpImage.bitmap.width / 2) - (width / 2), (jimpImage.bitmap.height / 25) + shift, args.text);
		jimpImage.print(borderFont, (jimpImage.bitmap.width / 2) - (width / 2), (jimpImage.bitmap.height / 25) - shift, args.text);
		const font = await Jimp.loadFont((jimpImage.bitmap.width - ((64 / 2) * args.text.length)) > 50 ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_32_BLACK);
		jimpImage.print(font, (jimpImage.bitmap.width / 2) - (width / 2), jimpImage.bitmap.height / 25, args.text);
		return await jimpImage.writeAsync(image);
	},
};
async function combine(id) {
	const combineArgs = `-i|${`${editFolder}${id}%d.png`}|${editFolder}${id}.gif`.split('|');
	await execFile('ffmpeg', combineArgs).then(async () =>{
		const frames = _getAllFilesFromFolder(editFolder).filter(file => file.includes(id) && file.includes('.png'));
		for (const frame of frames) {
			await fsp.writeFile(frame, '');
			await fsp.unlink(frame);
		}
	});
	return {
		gif: `${editFolder}${id}.gif`,
	};
}
async function init() {
	const media = workerData.media;
	const id = Math.random().toString();
	const startImage = await Jimp.read(media);
	const path = `${editFolder}${id}.${startImage._originalMime.split('/')[1]}`;
	if (startImage._originalMime.split('/')[1] == 'gif') {
		const gifArgs = `-i|${media}|${editFolder}${id}%d.png`.split('|');
		await execFile('ffmpeg', gifArgs);
	}
	else {
		await fsp.writeFile(path, '');
		await fsp.unlink(path);
		await startImage.writeAsync(path);
	}
	return {
		image: startImage,
		id: id,
		type: startImage._originalMime.split('/')[1],
		path: path,
	};
}

if (!isMainThread) {
	parentPort.postMessage({ status: 'start' });
	init()
		.then(async result =>{
			if (result.type == 'gif') {
				await loopFunction(functions[workerData.method], result.id, workerData.args);
				const results2 = await combine(result.id);
				parentPort.postMessage({
					attachment: new Discord.MessageAttachment(results2.gif, `${Math.random().toString()}.gif`),
					status: 'done',
				});
				return setTimeout(async () =>{
					await fsp.unlink(`${editFolder}${result.id}.gif`);
				}, 1000 * 5);
			}
			else {
				await functions[workerData.method]({ image: result.path, args: workerData.args });
				parentPort.postMessage({
					attachment: new Discord.MessageAttachment(`${editFolder}${result.id}.${result.type}`, `${Math.random().toString()}.${result.type}`),
					status: 'done',
				});
				return setTimeout(async () =>{
					await fsp.unlink(`${editFolder}${result.id}.${result.type}`);
				}, 1000 * 5);
			}
		});
}