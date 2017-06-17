'use strict';

const express = require('express');
const app = express();
const controller = require('./controller');
controller.seed();

app.set('view engine', 'pug');



app.get('/', controller.index);

app.get('/testdata', controller.getScores);

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});