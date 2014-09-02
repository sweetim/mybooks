'use strict';

var google = require('googleapis'),
	googleOAuth2 = google.auth.OAuth2,
	googlePlus = google.plus('v1');

var authKey = require('../config/auth').google;

var clientGoogleOAuth2 = new googleOAuth2(authKey.clientId, authKey.secret, authKey.redirectUrl);
var scopes = [
	'https://www.googleapis.com/auth/plus.login',
	'https://www.googleapis.com/auth/userinfo.email',
];

exports.login = function(req, res){
	var url = clientGoogleOAuth2.generateAuthUrl({
		access_type: 'offline',			//jshint ignore:line
		scope: scopes
	});

	res.redirect(url);
};

exports.callback = function(req, res, next){
	if (req.query.code) {
		var code = req.query.code;

		clientGoogleOAuth2.getToken(code, function(err, token){
			if (err) {
				next(new Error('Google + obtain token failed'));
			} else {
				clientGoogleOAuth2.setCredentials(token);
				googlePlus.people.get({
					userId: 'me',
					auth: clientGoogleOAuth2
				}, function(err, user){
					console.log(user);
				});
				res.redirect('/');
			}
		});
	} else {
		next(new Error('Google + login failed'));
	}
};

exports.clientLogin = function(req, res, next){
	
};