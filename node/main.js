'use strict';

const express = require('express');
const app = express();
let fs = require('fs');
let repository = require('./repository.js');
console.log(repository.getCurrentDateString());

app.set('view engine', 'pug');



app.get('/', function (req, res) {

	res.render('index', {message: ""});
});

app.get('/testdata', function(req, res) {
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
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});