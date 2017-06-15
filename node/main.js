'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'pug');

let testData = require('./testdata.json');

app.get('/', function (req, res) {
	res.render('index', {message: "testing", data: JSON.stringify(testData)});
});

app.get('/testdata', function(req, res) {
	res.send(JSON.stringify(testData));
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});