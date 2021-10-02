const data = {
	'number': 1,
};

exports.getData = function(key) {
	return data[key];
};

exports.getAllData = function() {
	return data;
};

exports.setData = function(key, newData) {
	data[key] = newData;
};
