const ffmpeg = require('ffmpeg');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const fs = require('fs');
const canvas = require('canvas');

const events = require('events');
const eventEmitter = new events.EventEmitter();

let disregardframes = false;

// types: image, gif, video

const fileTypes = {
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
const convertTo = {
	'video': 'mp4',
	'gif': 'gif',
	'image': 'png',
	'audio': 'mp3',
};
const applyText = (Canvas, text) => {
	const context = Canvas.getContext('2d');

	let fontSize = 50;

	do {
		context.font = `${fontSize -= 10}px sans-serif`;

	} while (context.measureText(text).width > canvas.width - (canvas.width / 2));

	return context.font;
};

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
async function clear(dir, toClear = []) {
	if (toClear.includes('input')) {
		fs.writeFileSync(dir, '');
		fs.unlinkSync(dir);
	}
	if (toClear.includes('frames')) {
		const frames = _getAllFilesFromFolder(__dirname + '/imageframes');
		frames.forEach(async function(item) {
			fs.writeFileSync(item, '');
			fs.unlinkSync(item);
		});
	}
	if (toClear.includes('audio')) {
		fs.writeFileSync(__dirname + '/audio.mp3', '');
		fs.unlinkSync(__dirname + '/audio.mp3');
	}
}
async function returnFileType(file) {
	const typesArray = Object.entries(fileTypes);
	const type = file.substring(file.lastIndexOf('.') + 1);
	console.log(type);
	const result = typesArray.find(types => types[1].includes(type));
	if (!result) return eventEmitter.emit('unsupported');
	return result[0];
}

async function editImage(image, method, args = []) {
	const methods = {
		'invert': async function() {
			const img = await canvas.loadImage(image);
			const Canvas = canvas.createCanvas(img.width, img.height);
			const ctx = Canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, Canvas.width, Canvas.height);
			ctx.globalCompositeOperation = 'difference';
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, Canvas.width, Canvas.height);
			return fs.writeFileSync(image, Canvas.toBuffer());
		},
		'caption': async function() {
			const text = args[0];
			const img = await canvas.loadImage(image);
			const Canvas = canvas.createCanvas(img.width, img.height);
			const ctx = Canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			ctx.font = applyText(canvas, text);
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height / 4);
			ctx.fillStyle = '#ffffff';
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = '#000000';
			ctx.fillText('you\'re mom', canvas.width / 4, canvas.height / 5.5);
			fs.writeFileSync(image, Canvas.toBuffer());
		},
	};
	if (!methods[method]) return 'disregardframes';
	return await methods[method]();
}
async function editAudio(audio, method, args = []) {
	const methods = {
		'volume': async function() {
			console.log(args);
			fs.writeFileSync(__dirname + '/audio2.mp3', '');
			fs.unlinkSync(__dirname + '/audio2.mp3');
			const volumeArgs = `-i  ${audio}  -filter:a  "volume=${args[0]}"  ${__dirname + '/audio2.mp3'}`;
			await execFile('ffmpeg', volumeArgs.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
			await clear(null, ['audio']);
			await execFile('ffmpeg', `-i  audio2.mp3  ${audio}`.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
			fs.writeFileSync(__dirname + '/audio2.mp3', '');
			fs.unlinkSync(__dirname + '/audio2.mp3');
			return;
		},
	};
	if (!methods[method]) return;
	return await methods[method]();
}
async function editVideo(dir, method, args = []) {
	const methods = {
		'reverse': async function() {
			fs.writeFileSync(__dirname + '/input2.mp4', '');
			fs.unlinkSync(__dirname + '/input2.mp4');
			const reverseArgs = `-i  ${dir}  -vf  reverse  -af  areverse  ${__dirname + '/input2.mp4'}`;
			await execFile('ffmpeg', reverseArgs.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
			await clear(dir, ['input']);
			await execFile('ffmpeg', `-i  input2.mp4  ${dir}`.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
			fs.writeFileSync(__dirname + '/input2.mp4', '');
			fs.unlinkSync(__dirname + '/input2.mp4');
			return;
		},
	};
	if (!methods[method]) return;
	return await methods[method]();
}
module.exports = {
	async edit(content) {
		eventEmitter.emit('start');
		const type = await returnFileType(content.url);
		if (typeof type != 'string') return;
		const dir = __dirname + `/input.${convertTo[type]}`;

		// Clear prev. input
		console.log('Clearing prev. input..');
		await clear(dir, ['input', 'frames', 'audio']);

		// Download
		console.log('Downloading content..');
		const downloadArgs = `-i  ${content.url}  ${dir}`;
		await execFile('ffmpeg', downloadArgs.split('  '))
			.catch(async error =>{
				return eventEmitter.emit('error', error);
			});

		// Extract frames
		console.log('Extracting frames..');
		const framesArgs = `-i  ${dir}  ${__dirname + '/imageframes/'}frame%d.png`;
		await execFile('ffmpeg', framesArgs.split('  '))
			.catch(async error =>{
				return eventEmitter.emit('error', error);
			});

		if (type == 'video') {
			// Extract audio
			console.log('Extracting audio..');
			const audioArgs = `-i  ${dir}  ${__dirname + '/audio.mp3'}`;
			await execFile('ffmpeg', audioArgs.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
		}

		// Edit Frames
		console.log('Editing frames..');
		const frames = _getAllFilesFromFolder(__dirname + '/imageframes');
		for (let i = 0;i < frames.length;i++) {
			console.log(`${Math.round(((i + 1) / frames.length) * 100)}% done..`);
			await editImage(frames[i], content.method, content.args)
				.then(async result =>{
					if (result == 'disregardframes') {
						disregardframes = true;
					}
				});
		}

		if (type == 'video') {
			// Edit Audio
			console.log('Editing Audio..');
			await editAudio(__dirname + '/audio.mp3', content.method, content.args);

			// Edit video
			console.log('Editing video..');
			await editVideo(dir, content.method, content.args);
		}

		if (!disregardframes) {
			// Compile frames
			console.log('Compiling frames..');
			clear(dir, ['input']);
			const compileArgs = type == 'video' ? `-i  ${__dirname + '/imageframes/'}frame%d.png  -i  audio.mp3  ${dir}` : `-i  ${__dirname + '/imageframes/'}frame%d.png  ${dir}`;
			await execFile('ffmpeg', compileArgs.split('  '))
				.catch(async error =>{
					return eventEmitter.emit('error', error);
				});
		}
		disregardframes = false;
		return eventEmitter.emit('done', dir);
	},
	async returnEvent() {
		return eventEmitter;
	},
};
