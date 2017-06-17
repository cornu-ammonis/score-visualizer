'use strict';

const express = require('express');
const app = express();
let fs = require('fs');
let repository = require('./repository.js');
console.log(repository.getCurrentDateString());

app.set('view engine', 'pug');

var data = {users: ['joe', 'jon', 'jake', 'june', 'six', 'seven', 'eight eight', 'nine', 'ten'], points: []};
var data1 = [];
var data2 = []
data1[0] = {date: "2017-6-01-06-05", value: 1 };
data1[1] = {date: "2017-6-02-02-07", value: 2 };
data1[2] = {date: "2017-6-03-03-07", value: 5 };
data1[3] = {date: "2017-6-05-06-05", value: 10 };
data1[4] = {date: "2017-6-06-02-07", value: 15 };
data1[5] = {date: "2017-6-07-10-07", value: 20 };

data2[0] = {date: "2017-6-01-06-05", value: 1 };
data2[1] = {date: "2017-6-02-02-07", value: 5 };
data2[2] = {date: "2017-6-03-03-07", value: 10 };
data2[3] = {date: "2017-6-04-06-05", value: 15 };
data2[4] = {date: "2017-6-05-02-07", value: 20 };
data2[5] = {date: "2017-6-06-03-07", value: 25 };

var data3 = [];
var data4 = []
data3[0] = {date: "2017-6-01-06-05", value: 1 };
data3[1] = {date: "2017-6-02-01-07", value: 2 };
data3[2] = {date: "2017-6-03-04-07", value: 5 };
data3[3] = {date: "2017-6-04-06-05", value: 11 };
data3[4] = {date: "2017-6-06-02-07", value: 15 };
data3[5] = {date: "2017-6-08-10-07", value: 20 };

data4[0] = {date: "2017-6-01-06-05", value: 1 };
data4[1] = {date: "2017-6-02-02-07", value: 5 };
data4[2] = {date: "2017-6-03-03-07", value: 10 };
data4[3] = {date: "2017-6-04-09-05", value: 15 };
data4[4] = {date: "2017-6-05-02-07", value: 20 };
data4[5] = {date: "2017-6-07-03-07", value: 25 };

var data5 = [];
var data6 = []
data5[0] = {date: "2017-6-01-06-05", value: 1 };
data5[1] = {date: "2017-6-02-02-07", value: 9 };
data5[2] = {date: "2017-6-03-03-07", value: 5 };
data5[3] = {date: "2017-6-05-06-05", value: 11 };
data5[4] = {date: "2017-6-06-02-07", value: 15 };
data5[5] = {date: "2017-6-07-10-07", value: 35 };

data6[0] = {date: "2017-6-01-06-05", value: 1 };
data6[1] = {date: "2017-6-02-02-07", value: 5 };
data6[2] = {date: "2017-6-03-03-07", value: 14 };
data6[3] = {date: "2017-6-04-06-05", value: 15 };
data6[4] = {date: "2017-6-05-02-07", value: 27 };
data6[5] = {date: "2017-6-06-03-07", value: 33 };

var data7 = [];
var data8 = []
data7[0] = {date: "2017-6-01-06-05", value: 1 };
data7[1] = {date: "2017-6-02-01-07", value: 2 };
data7[2] = {date: "2017-6-03-04-07", value: 9 };
data7[3] = {date: "2017-6-04-06-05", value: 11 };
data7[4] = {date: "2017-6-06-02-07", value: 19};
data7[5] = {date: "2017-6-08-10-07", value: 20 };

data8[0] = {date: "2017-6-01-06-05", value: 1 };
data8[1] = {date: "2017-6-02-02-07", value: 5 };
data8[2] = {date: "2017-6-03-03-07", value: 10 };
data8[3] = {date: "2017-6-04-09-05", value: 15 };
data8[4] = {date: "2017-6-05-02-07", value: 20 };
data8[5] = {date: "2017-6-07-03-07", value: 40 };



data.points.push(data1);
data.points.push(data2);
data.points.push(data3);
data.points.push(data4);
data.points.push(data5);
data.points.push(data6);
data.points.push(data7);
data.points.push(data8);
fs.writeFileSync('./data/userscores.json', JSON.stringify(data)); 
repository.addScoreToUser('jon', 30);
repository.addScoreToUser('joe', 29);
repository.addScoreToUser('bob', 10);
repository.addScoreToUser('june', 40);
repository.addScoreToUser('jake', 35);
repository.addScoreToUser('eight eight', 35);
repository.addScoreToUser('seven', 40);
repository.addScoreToUser('eleven', 25);

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