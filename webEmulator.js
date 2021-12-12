const { isMainThread, workerData, parentPort } = require('worker_threads');
const puppeteer = require('puppeteer');

let doScreenshot = true;

async function updateScreen(page) {
	setInterval(async () =>{
		if (doScreenshot) {
			await page.screenshot({ path: `${process.cwd()}/webScreenshot.png` })
				.then(async () => parentPort.postMessage({ status: 'screenshot' }));
		}
	}, 1000);
}

(async () => {
	if (!isMainThread) {
		parentPort.postMessage({ status: 'start' });
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto('https://www.google.com');

		parentPort.on('message', async args => {
			if (args.method == 'gotoURL') {
				await page.goto(args.url);
			}
			if (args.method == 'startScreenshot') {
				doScreenshot = true;
				updateScreen(page);
			}
			if (args.method == 'stopScreenshot') {
				doScreenshot = false;
			}
		});
	}
})();