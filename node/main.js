'use strict';

const express = require('express');
const app = express();


app.set('view engine', 'pug');

let testData = require('./testdata.json');

app.get('/', function (req, res) {

	res.render('index', {message: "testing", data: JSON.stringify(testData)});
});

app.get('/testdata', function(req, res) {
	var data = {users: ['joe', 'jon', 'gerg'], points: []};
	var data1 = [];
	var data2 = []
	data1[0] = {date: "2014-01-01-06-05", value: 10 };

	data1[1] = {date: "2014-01-02-02-07", value: 15 };
	data1[2] = {date: "2014-01-02-03-07", value: 30 };

	data2[0] = {date: "2014-01-01-06-05", value: 13 };
	data2[1] = {date: "2014-01-01-10-05", value: 20 };
	data2[2] = {date: "2014-01-02-01-01", value: 25 };

	data.points.push(data1);
	data.points.push(data2);
	res.send(JSON.stringify(data));
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});