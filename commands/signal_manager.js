const child_process = require('child_process');

module.exports = {
	good: 'yes',
	async execute() {
    console.log('executed')
    try {
      child_process.spawn('C:/Users/Ethan/Desktop/Epic Gamer Bot/signal_emitter.bat');
    }
    catch(error) {
      console.log(error)
    }
	},
};
