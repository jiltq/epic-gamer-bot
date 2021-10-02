var fs = require('fs')
  , gm = require('gm');
module.exports = {
	name: 'giftoimage',
	description: 'Ping',
	async execute(message, args) {
		const image = gm('C:/Users/Ethan/Desktop/why.png')
		.flip()
		.magnify()
		.rotate('green', 45)
		.blur(7, 3)
		.crop(300, 300, 150, 130)
		.edge(3)
		fs.writeFileSync('C:/Users/Ethan/Desktop/crazy.png', image);
	},
};
