'use strict';

var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken');

var User = mongoose.model('User');

var errorHandler = require('../utils/errorHandler');
var config = require('../config/auth');

exports.register = function(req, res, next){
	var password = req.body.password;
	var username = req.body.username;

	//Check username
	User.findOne({
		username: username
	}, function(err, user){
		if (err) {
			return next(err);
		} else {
			if (user) {
				next(errorHandler(400, 'Username taken'));
			} else {
				//Create new user
				var newUser = new User({
					username: username,
					hash: password
				});

				newUser.save(function(err, user){
					if (err) {
						return next(err);
					} else {
						var token = jwt.sign({
							"iss": user.username
						}, config.jwt.secret, {
							expiresInMinutes: config.jwt.exp
						});

						res.json({
							result: 1,
							userId: user.username,
							token: token
						});
					}
				});
			}
		}
	});
};

exports.login = function(req, res, next){
	var password = req.body.password;
	var username = req.body.username;

	User.findOne({
		username: username
	}, function(err, user){
		if (err) {
			next(err);
		} else {
			if (user) {
				user.comparePassword(password, function(err, isMatch){
					if (isMatch) {

						var token = jwt.sign({
							"iss": user.username
						}, config.jwt.secret, {
							expiresInMinutes: config.jwt.exp
						});

						res.json({
							result: 1,
							userId: user.username,
							token: token
						});
					} else {
						next(errorHandler(401, 'Password invalid'));
					}
				});			
			} else {
				next(errorHandler(401, 'Username invalid'));
			}
		}
	});
};

exports.authorization = function(req, res, next){
	var token = req.headers.authentication;

	if (token) {
		jwt.verify(token, config.jwt.secret, function(err, decoded){
			if (err) {
				next(errorHandler(403, 'Access token expired'));
			} else {
				User.findOne({
					username: decoded.iss
				}, function(err, user){
					if (err) {
						return next(err);
					} else {
						req.user = user;
						next();
					}
				});
			}
		});

	} else {
		next(errorHandler(403, 'Access token not found'));
	}
};


