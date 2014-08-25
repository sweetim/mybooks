'use strict';

module.exports = function(){
	var mongoose = require('mongoose');

	var bookSchema = mongoose.Schema({
		isbn: {
			type: Number,
			required: true,
			unique: true
		},
		title: {
			type: String,
			required: true
		},
		author: [{
			type: String,
			required: true
		}],
		pageNumber: {
			type: Number,
			required: true
		},
		publisher: {
			type: String
		},
		publishDate: {
			type: String
		},
		thumbnail: {
			small: String,
			normal: String
		},
		dateCreated: {
			type: Date,
			required: true,
			default: Date.now
		}
	});

	mongoose.model('Book', bookSchema);
};