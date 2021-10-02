const defaultLocations = {
	'695662672687005737': '30.26928,-89.70928',
	'672546414642987040': '30.278641,-89.779373',
	'672931163777531915': '30.26928,-89.70928',
};

exports.defaultLocation = function(key) {
	console.log(key);
	console.log(defaultLocations[key]);
	return defaultLocations[key];
};
