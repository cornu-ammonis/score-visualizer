let fs = require('fs');
const repository = require('./repository.js');

exports.seed = function () {
	let tester = require('./testing.js');
	tester.seedDataToUserScoresFile(repository, fs);
}

exports.index = function(req, res) {
	res.render('index', {message: ""});
}

exports.getScores = function (req, res) {
	let data = repository.retrieveUserScores();

	// error conditions
	if (data === null) {
		res.send('no scores found -- probably none have been submitted yet');
		return;
	}
	if (data === undefined) {
		res.send('something went wrong reading in scores from disk. consult error logs');
		return;
	}


	res.send(JSON.stringify(data));
}