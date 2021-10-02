var client;

exports.update = function(newClient) {
	client = newClient;
};
exports.get = function() {
	return client;
};
