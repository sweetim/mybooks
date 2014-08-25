'use strict';

var assert = require('assert'),
	mongoose = require('mongoose'),
	auth = require('../../server/routes/auth');

before(function(){
	//Connect to DB
	var config = require('../../server/config/env/development');
	require('../../server/config/db')(config);
});

describe('User schema', function(){
	it('#login', function(){
		
	});

	it('#register', function(){
		
	});

	it('#authorization', function(){

	});
});


