'use strict';

var mongoose = require('mongoose');

var BookCollection = mongoose.model('BookCollection'),
	Book = mongoose.model('Book');

var authKey = require('../config/auth'),
	provider = require('../config/provider');

var httpsRequest = require('../utils/httpsRequest');

//Store book into user collection
//Check book if in db, else query from Google Books
exports.postCollection = function(req, res, next){
	var isbn = req.body.isbn;

	var newBookCollection = {
		userId: req.user._id,
		isbn: isbn
	};

	BookCollection.create(newBookCollection, function(err){
		if (err) {
			next(err);
		} else {
			Book.findOne({
				isbn: isbn
			}, function(err, book){
				if (err) {
					next(err);
				} else {
					//Book not exist
					if (!book) {
						var googleBookApiUrl = provider.google.book + isbn + "&key=" + authKey.google.apiKey;

						httpsRequest.get(googleBookApiUrl, function(err, data){
							if (err) {
								next(err);
							} else {
								if (data.totalItems > 0) {
									var volumeInfo = data.items[0].volumeInfo;
									var newBook = {};
									//Need to fix missing thumbnail
									if (volumeInfo.imageLinks !== null) {
										newBook = {
											isbn: isbn,
											title: volumeInfo.title,
											author: volumeInfo.authors,
											pageNumber: volumeInfo.pageCount,
											publisher: volumeInfo.publisher,
											publishDate: volumeInfo.publishedDate,
											thumbnail: {
												small: volumeInfo.imageLinks.smallThumbnail,
												normal: volumeInfo.imageLinks.thumbnail
											}
										};
									} else {
										newBook = {
											isbn: isbn,
											title: volumeInfo.title,
											author: volumeInfo.authors,
											pageNumber: volumeInfo.pageCount,
											publisher: volumeInfo.publisher,
											publishDate: volumeInfo.publishedDate,
											thumbnail: {
												small: "http://img4.wikia.nocookie.net/__cb20140304134752/epic-rap-battles-of-cartoons/images/9/9f/Doraemon.png",
												normal: "http://img4.wikia.nocookie.net/__cb20140304134752/epic-rap-battles-of-cartoons/images/9/9f/Doraemon.png"
											}
										};
									}


									Book.create(newBook, function(err, book){
										if (err) {
											next(err);
										} else {
											res.json({
												result: 1,
												bookInfo: book
											});
										}
									});
								} else {
									next(new Error('Unknown ISBN'));
								}
							}
						});					
					} else {
						res.json({
							result: 1,
							bookInfo: book
						});
					} 
				}
			});
		}
	});
};

exports.getCollection = function(req, res, next){	
	BookCollection.find({
		userId: req.user._id
	}).sort({
		dateCreated: -1
	}).exec(function(err, collection){
		if (err) {
			next(err);
		} else {
			var isbnCollection = [];

			for(var i = 0; i < collection.length; i++){
				var collectionInfo = {};
				collectionInfo.isbn = collection[i].isbn;
				collectionInfo.dateCreated = collection[i].dateCreated;
				collectionInfo.quantity = collection[i].quantity;
				isbnCollection.push(collectionInfo);
			}

			res.json({
				result: 1,
				totalCollection: isbnCollection.length,
				collection: isbnCollection
			});
		}
	});
};

exports.deleteCollection = function(req, res, next){
	var quantity = req.query.q,
		isbn = req.params.isbn;

	var collectionToRemove = {
		userId: req.user._id,
		isbn: isbn
	};

	if (quantity) {
		
	} else {
		BookCollection.remove(collectionToRemove, function(err){
			if (err) {
				next(err);
			} else {
				res.json({
					result: 1
				});
			}
		});
	}
};

exports.getBook = function(req, res, next){
	var isbn = req.params.isbn;

	Book.findOne({
		isbn: isbn
	}, function(err, book){
		if (err) {
			next(err);
		} else {
			res.json({
				result: 1,
				bookInfo: book
			});
		}
	});
};