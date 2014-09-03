'use strict';

var google = require('googleapis'),
	mongoose = require('mongoose'),
	googleOAuth2 = google.auth.OAuth2,
	googlePlus = google.plus('v1'),
	jwt = require('jsonwebtoken');

var User = mongoose.model('User');

var config = require('../config/auth');
var authKey = config.google;

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
				}, function(err, gPlusUserInfo){
					var email = gPlusUserInfo.emails[0].value;
					var username = gPlusUserInfo.displayName;

					User.findOne({
						email: email
					}, function(err, user){
						if (err) {
							return next(err);
						} else {
							var token = jwt.sign({
								"iss": username
							}, config.jwt.secret, {
								expiresInMinutes: config.jwt.exp
							});

							if (user) {
								res.json({
									result: 1,
									userId: user.username,
									token: token
								});
							} else {
								var newUser = new User({
									email: email,
									username: username
								});

								newUser.save(function(err, newUserInfo){
									if (err) {
										return next(err);
									} else {
										res.json({
											result: 1,
											userId: newUserInfo.username,
											token: token
										});
									}									
								});
							}
						}
					});
				});
			}
		});
	} else {
		next(new Error('Unknown Google login code'));
	}
};
