'use strict';

const express = require('express');
const app = express();
const controller = require('./controller');
controller.seed();

app.set('view engine', 'pug');


app.get('/graph', controller.index);

app.get('/testdata', controller.getScores);

app.get('/', controller.getRanks);

app.get('/updatescore/:pw/:username/:score', controller.updateScore);

app.get('/updateflags', controller.updateFlags);

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});