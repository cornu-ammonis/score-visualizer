let fs = require('fs');
const repository = require('./repository.js');
const hash = require('md5');

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

exports.getRanks = function (req, res) {
	let data = repository.retrieveUserRanks();

	if (data === null) {
		res.send('no ranks found');
		return
	}

	if (data === undefined) {
		res.send('something went wrong reading ranks from disk');
	}

	res.render('ranks', {users: data});
}

exports.updateScore = function (req, res) {
	let pwhash = require('./data/secret.json');
	let givenPwHash = hash(req.params['pw']);
	console.log(pwhash);
	console.log(givenPwHash);

	if (pwhash.pw === givenPwHash) {
		repository.addScoreToUser(req.params['username'], req.params['score']);
		res.send('success');
	}
	else {
		res.send('invalid password token');
	}
}