const { isMainThread, workerData, parentPort } = require('worker_threads');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const Jimp = require('jimp');
const fsp = require('fs').promises;
const fs = require('fs');
const Discord = require('discord.js');

const { link, method } = workerData;
const editFolder = `${process.cwd()}/editFiles/`;

const extensionTypes = {
	'video': [
		'mp4',
		'mov',
		'webm',
		'wmv',
	],
	'gif': [
		'gif',
	],
	'image': [
		'png',
		'jpg',
		'jpeg',
		'bmp',
	],
	'audio': [
		'mp3',
		'ogg',
		'wav',
	],
};

const functions = {
    reverse: async function({ image, args }) {

    }
}

async function download() {
	const extension = link.substring(link.lastIndexOf('.') + 1);
	const id = Math.random().toString();
	const path = `${editFolder}${id}.${extension}`;
	const startImage = await Jimp.read(link);
	if (!extensionTypes.image.includes(extension)) {
		const args = `-i|${link}|${editFolder}${id}_frame-%d.png`.split('|');
		await execFile('ffmpeg', args);
	}
	else {
		await fsp.writeFile(path, '');
		await fsp.unlink(path);
		await startImage.writeAsync(path);
	}
}
if (!isMainThread) {
	parentPort.postMessage({ status: 'start' });
	download()
		.then(async () =>{
			parentPort.postMessage({ status: 'downloaded' });
		});
}