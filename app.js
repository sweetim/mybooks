'use strict';

var express = require('express'),
	bodyParser = require('body-parser');

var app = express();

var config = require('./server/config/env/' + app.get('env'));
require('./server/config/db')(config);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./client/src/'));

var routes = require('./server/routes');

app.post('/auth/register', routes.auth.register);
app.post('/auth/login', routes.auth.login);

app.use('/api', routes.auth.authorization);

app.post('/api/collection', routes.book.postCollection);
app.get('/api/collection', routes.book.getCollection);


app.use(function(err, req, res, next){ // jshint ignore:line	
	if (!err.code) {
		err.code = 500;
	} 

	res.status(err.code).json({
		result: 0,
		err: err.message
	});

	console.log(err);
});

app.listen(config.port, function(){
	console.log('Server started in port ' + config.port);
});

