'use strict';

module.exports = function(){
	var mongoose = require('mongoose');

	var bookSchema = mongoose.Schema({
		isbn: {
			type: String,
			required: true,
			unique: true
		},
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String
		},
		author: [{
			type: String,
			required: true
		}],
		description: {
			type: String
		},
		contentVersion: {
			type: String
		},
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
		categories: {
			type: Array
		},
		language: {
			type: String
		},
		printType: {
			type: String
		},
		thumbnail: {},
		dateCreated: {
			type: Date,
			required: true,
			default: Date.now
		}
	});

	mongoose.model('Book', bookSchema);
};