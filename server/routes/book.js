'use strict';

var mongoose = require('mongoose'),
	https = require('https');

var BookCollection = mongoose.model('BookCollection'),
	Book = mongoose.model('Book');

var authKey = require('../config/auth'),
	provider = require('../config/provider');

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
			res.json({
				result: 1
			});
		}
	});

	Book.findOne({
		isbn: isbn
	}, function(err, book){
		if (err) {
			next(err);
		} else {
			//Book not exist
			if (!book) {
				var googleBookApiUrl = provider.google.book + isbn + "&key=" + authKey.google.apiKey;

				https.get(googleBookApiUrl, function(result){		
					result.on('data', function(data){
						var dataJSON = JSON.parse(data);

						if (dataJSON.totalItems > 0) {
							var volumeInfo = dataJSON.items[0].volumeInfo;

							var newBook = {
								isbn: isbn,
								title: volumeInfo.title,
								author: volumeInfo.authors,
								pageNumber: volumeInfo.pageCount,
								publisher: volumeInfo.publisher,
								publishDate: volumeInfo.publishedDate,
								thmbnail: {
									small: volumeInfo.imageLinks.smallThumbnail,
									normal: volumeInfo.imageLinks.thumbnail
								}
							};

							Book.create(newBook, function(err){
								if (err) {
									next(err);
								}
							});
						} 
					});
				});
			} 
		}
	});
};

exports.getCollection = function(req, res, next){	
	BookCollection.find({
		userId: req.user._id
	}, function(err, collection){
		if (err) {
			next(err);
		} else {
			var books = [];
			for(var i = 0; i < collection.length; i++){
				var book = {};
				book.isbn = collection[i].isbn;
				Book.findOne({
					isbn: book.isbn
				}, function(err, data){
					if (err) {
						next(err);
					} else {
						book.title = data.title;
						book.author = data.author;
						book.pageNumber = data.author;
						book.publisher = data.publisher;
						book.publishedDate = data.publishedDate;
						book.thumbnail = data.thumbnail;
						book.dateCreated = data.dateCreated;

						console.log(data.thumbnail);

					}
				});
			}

		}
	});
};
