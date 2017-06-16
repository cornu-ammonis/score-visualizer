'use strict';

const express = require('express');
const app = express();
let fs = require('fs');


app.set('view engine', 'pug');

/* var data = {users: ['joe', 'jon', 'gerg'], points: []};
var data1 = [];
var data2 = []
data1[0] = {date: "2014-01-01-06-05", value: 10 };
data1[1] = {date: "2014-01-02-02-07", value: 15 };
data1[2] = {date: "2014-01-03-03-07", value: 30 };
data1[3] = {date: "2014-01-05-06-05", value: 35 };
data1[4] = {date: "2014-01-06-02-07", value: 36 };
data1[5] = {date: "2014-01-06-03-07", value: 45 };

data2[0] = {date: "2014-01-01-06-05", value: 10 };
data2[1] = {date: "2014-01-02-02-07", value: 15 };
data2[2] = {date: "2014-01-03-03-07", value: 30 };
data2[3] = {date: "2014-01-04-06-05", value: 37 };
data2[4] = {date: "2014-01-05-02-07", value: 40 };
data2[5] = {date: "2014-01-06-03-07", value: 60 };

data.points.push(data1);
data.points.push(data2);
fs.writeFileSync('./data/test/testscores.json', JSON.stringify(data)); */

app.get('/', function (req, res) {

	res.render('index', {message: ""});
});

app.get('/testdata', function(req, res) {
	let data = require('./data/test/testscores.json');
	res.send(JSON.stringify(data));
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});