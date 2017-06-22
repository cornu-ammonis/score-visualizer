let fs = require('fs');
const repository = require('./repository.js');
const hash = require('md5');
const tester = require('./testing.js');
const now = require('performance-now');
var hashOfSolvedFile;

var seedCount = 0;


// to do - save old file and take only new lines
exports.seed = function () {
	//let tester = require('./testing.js');
	//tester.seedDataToUserScoresFile(repository, fs);
	//tester.testUnixTs(repository);
	//tester.testAliases();


	if (hashOfSolvedFile === undefined) {
		t0 = now();
		hashOfSolvedFile = hash(fs.readFileSync('./data/solved.txt').toString());
		t1 = now();
		result = (t1-t0).toFixed(3);
		console.log('took ' + result + " ms to read and hash scores file to " + hashOfSolvedFile);
		console.log('initial seed, hashing and constructing database..');
	}
	else {
		let oldHash = hashOfSolvedFile;
		let t0 = now();
		hashOfSolvedFile = hash(fs.readFileSync('./data/solved.txt').toString());
		let t1 = now();
		result = (t1-t0).toFixed(3);
		console.log('took ' + result + " ms to read and hash scores file to " + hashOfSolvedFile);

		if (hashOfSolvedFile !== oldHash) {
			console.log('hash differed! updating database...');
			t0 = now();
			repository.readScoresFromSolvedFile();
			t1 = now();
			result = (t1-t0).toFixed(3);
			console.log('took ' + result + " ms to read scores from file");
		}
	}
	
	seedCount = seedCount + 1;
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
	let pw = req.params['pw'];

	if (pw === undefined) {
		res.end('must provide a password as first query parameter');
	}

	let givenPwHash = hash(req.params['pw']);

	if (pwhash.pw === givenPwHash) {
		
		let username = req.params['username'];
		
		if (username === undefined) {
			res.end('no username given');
		}

		let score = req.params['score'];
		
		if (score === undefined) {
			res.end('no score given');
		}
		

		if (isNaN(score)) {
			res.end('score must be a number');
		}


		repository.addScoreToUser(username, score);
		res.end('success');
	}
	else {
		res.send('invalid password token');
	}


}

	exports.updateFlags = function (req, res) {
		try {
			repository.readScoresFromSolvedFile();
			res.send('success');
		}
		catch (e){
			res.send('failure ' + e.message);
		}
		
	}, 

	exports.getSeedCount = function(req, res) {
		res.send('seed count: ' + seedCount);
	}