'use strict';

module.exports = function(config){
	var mongoose = require('mongoose');

	var dbURI = config.db.url + ":" + config.db.port + "/" + config.db.name; 
	var dbOptions = {
		auth: {
			authdb: 'mybooks'
		},
		user: config.db.user,
		pass: config.db.pass
	};

	mongoose.connect(dbURI, dbOptions);

	mongoose.connection.on('connected', function(){
		console.log('MongoDB connected ' + dbURI);
	});

	mongoose.connection.on('error', function(err) {
		console.log(err);
	});

	mongoose.connection.on('disconnected', function() {
		console.log('MongoDB disconnected ' + dbURI);
	});

	//Initialize schema
	require('../models/userSchema')();
	require('../models/bookSchema')();
	require('../models/bookCollectionSchema')();
};
