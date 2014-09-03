'use strict';

var config = require('../config/auth'),
	provider = require('../config/provider'),
	httpsRequest = require('../utils/httpsRequest');

var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken');

var User = mongoose.model('User');

var authKey = config.facebook;
var graphProvider = provider.facebook.graph;

exports.login = function(req, res, next){
	var token = req.body.token;

	if (token) {
		var inspectTokenUrl = "https://graph.facebook.com/debug_token?" +
			"input_token=" + token + 
			"&access_token=" + authKey.adminId;
		httpsRequest.get(inspectTokenUrl, function(err, data){
			if (err) {
				return next(err);
			} else {
				if (data.data.app_id === authKey.clientId && data.data.user_id) {	//jshint ignore:line
					var fbUserInfoUrl = graphProvider.url + graphProvider.version + "me?access_token=" + token;

					httpsRequest.get(fbUserInfoUrl, function(err, fbInfo){
						if (err) {
							return next(err);
						} else {
							if (fbInfo.error) {
								return next(new Error("Facebook token error"));
							} else {
								var email = fbInfo.email;
								var username = fbInfo.name;

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
							}	
						}
					});
				} else {
					res.json({
						result: 0,
						err: "Unknown access token from Facebook"
					});
				}
			}
		});

	} else {
		next(new Error("Unknown Facebook token"));
	}
};

