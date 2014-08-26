'use strict';

module.exports = function(){
	var mongoose = require('mongoose');

	var bookCollectionSchema = mongoose.Schema({
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		isbn: {
			type: String,
			required: true
		},
		quantity: {
			type: Number,
			default: 1
		},
		dateCreated: {
			type: Date,
			required: true,
			default: Date.now
		}
	});

	mongoose.model('BookCollection', bookCollectionSchema);
};