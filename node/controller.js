let fs = require('fs');
const repository = require('./repository.js');

exports.seed = function {
	let tester = require('./testing.js');
	tester.seedDataToUserScoresFile(repository, fs);
}