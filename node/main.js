'use strict';

const express = require('express');
const app = express();
let fs = require('fs');
let repository = require('./repository.js');
console.log(repository.getCurrentDateString());

app.set('view engine', 'pug');

var data = {users: ['joe', 'jon'], points: []};
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

data.points.push(data1);
data.points.push(data2);
fs.writeFileSync('./data/userscores.json', JSON.stringify(data)); 
repository.addScoreToUser('jon', 30);
repository.addScoreToUser('joe', 29);
repository.addScoreToUser('bob', 10);
app.get('/', function (req, res) {

	res.render('index', {message: ""});
});

app.get('/testdata', function(req, res) {
	let data = require('./data/userscores.json');
	res.send(JSON.stringify(data));
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});