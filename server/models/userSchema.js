'use strict';

var crypto = require('crypto');

var config = require('../config/auth');

var len = config.hashing.len;
var iterations = config.hashing.iteration;

module.exports = function(){
	var mongoose = require('mongoose');

	var userSchema = mongoose.Schema({
		username: {
			type: String,
			unique: true
		},
		email: {
			type: String,
			unique: true
		},
		salt: {
			type: String
		},
		hash: {
			type: String
		},
		dateCreated: {
			type: Date,
			required: true,
			default: Date.now
		}
	});

	userSchema.pre('validate', function(next){
		var user = this;

		if (user.hash) {
			//Generate salt
			crypto.randomBytes(len, function(err, salt){
				if (err) {
					next(err);
				} else {
					user.salt = salt.toString('base64');

					//Generate hash password with salt
					crypto.pbkdf2(user.hash, user.salt, iterations, len, function(err, hash){
						if (err) {
							next(err);
						} else {
							user.hash = hash.toString('base64');
							next();
						}
					});
				}
			});
		} else {
			next();
		}		
	});

	userSchema.methods.createHash = function(password, fn){
		var that = this;

		//Generate salt
		crypto.randomBytes(len, function(err, salt){
			if (err) {
				fn(err);
			} else {
				that.salt = salt.toString('base64');

				//Generate hash password with salt
				crypto.pbkdf2(password, that.salt, iterations, len, function(err, hash){
					if (err) {
						fn(err);
					} else {
						that.hash = hash.toString('base64');
						fn(null);
					}
				});
			}
		});		
	};

	userSchema.methods.comparePassword = function(password, fn){
		var storedSalt = this.salt;
		var storedHash = this.hash;

		crypto.pbkdf2(password, storedSalt, iterations, len, function(err, hash){
			if (err) {
				fn(err);
			} else {
				if (hash.toString('base64') === storedHash) {
					fn(null, true);
				} else {
					fn(null, false);
				}
			}
		});
	};

	mongoose.model('User', userSchema);
};

