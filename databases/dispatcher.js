var dispatcher;

var looped = false;

var downloading = false;

var playing = false;

const data = {
	'playing': false,
};

exports[0] = {
	dispatcher: null,
	looped: false,
};
exports[1] = {
	dispatcher: null,
	looped: false,
};

exports.update = function(newDispatcher) {
	dispatcher = newDispatcher;
};
exports.updateLoop = function(newState) {
	looped = newState;
};
exports.getLooped = function() {
	return looped;
};
exports.get = function() {
	return dispatcher;
};
exports.getVolume = function() {
	return dispatcher.volume;
};
exports.getDownloading = function() {
	return downloading;
};
exports.setDownloading = function(newState) {
	downloading = newState;
};
exports.setplaying = function(newstate) {
	playing = newstate;
	data['playing'] = newstate;
	console.log(data['playing'])
};
exports.getplaying = function() {
	return playing;
};

exports.internal = function(options) {
	return data[options.data];
};
