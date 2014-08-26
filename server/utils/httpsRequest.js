'use strict';

var https = require('https');

exports.get = function(url, callback){
	https.get(url, function(result){
		var rcvData = "";

		result.on('data', function(data){
			rcvData += data;
		});

		result.on('end', function(){
			var dataJSON = JSON.parse(rcvData);
			
			callback(null, dataJSON);
		});

		result.on('error', function(err){
			callback(err);
		});
	});
};
