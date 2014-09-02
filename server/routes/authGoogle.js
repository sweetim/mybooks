'use strict';

var google = require('googleapis'),
	googleOAuth2 = google.auth.OAuth2,
	googlePlus = google.plus('v1'),
	jwt = require('jsonwebtoken');

var authKey = require('../config/auth').google;
var config = require('../config/auth');

var clientGoogleOAuth2 = new googleOAuth2(authKey.clientId, authKey.secret, authKey.redirectUrl);

exports.login = function(req, res, next){
	var code = req.body.code;

	if (code) {
		clientGoogleOAuth2.getToken(code, function(err, token){
			if (err) {
				next(err);
			} else {
				clientGoogleOAuth2.setCredentials(token);
				googlePlus.people.get({
					userId: 'me',
					auth: clientGoogleOAuth2
				}, function(err, user){
					var token = jwt.sign({
						"iss": user.displayName
					}, config.jwt.secret, {
						expiresInMinutes: config.jwt.exp
					});

					res.json({
						result: 1,
						userId: user.displayName,
						token: token
					});
				});
			}
		});
	} else {
		res.json({
			result: 0,
			err: 'Unknown token'
		});
	}
};
