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

	BookCollection.findOne(newBookCollection, function(err, collection){
		if (err) {
			next(err);
		} else {
			if (collection) {
				collection.update({
					$inc: {
						quantity: 1
					}
				}, function(err){
					if (err) {
						next(err);
					} else {
						Book.findOne({
							isbn: collection.isbn
						}, function(err, book){
							res.json({
								result: 1,
								bookInfo: book
							});
						});
					}
				});
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
										var imageLinks = {};

										//Filter incoming result
										if (volumeInfo.hasOwnProperty('imageLinks')) {
											imageLinks = volumeInfo.imageLinks;
										} else {
											imageLinks = {
												smallThumbnail: "https://lh4.googleusercontent.com/-by3TNG1Dhtw/AAAAAAAAAAI/AAAAAAAAAN0/gOuqGurlI8o/photo.jpg?sz=64",
												thumbnail: "https://lh4.googleusercontent.com/-by3TNG1Dhtw/AAAAAAAAAAI/AAAAAAAAAN0/gOuqGurlI8o/photo.jpg?sz=64"
											};
										}

										newBook = {
											isbn: isbn,
											title: volumeInfo.title,
											subtitle: volumeInfo.subtitle,
											author: volumeInfo.authors,
											description: volumeInfo.description,
											contentVersion: volumeInfo.contentVersion,
											pageNumber: volumeInfo.pageCount,
											publisher: volumeInfo.publisher,
											publishDate: volumeInfo.publishedDate,
											categories: volumeInfo.categories,
											language: volumeInfo.language,
											printType: volumeInfo.printType,
											thumbnail: imageLinks
										};

										Book.create(newBook, function(err, book){
											if (err) {
												next(err);
											} else {
												BookCollection.create(newBookCollection, function(err){
													if (err) {
														next(err);
													} else {
														res.json({
															result: 1,
															bookInfo: book
														});
													}
												});
											}
										});
									} else {
										res.json({
											result: 0,
											err: 'Unknown ISBN code',
											bookInfo: null
										});
									}
								}
							});					
						} else {
							BookCollection.create(newBookCollection, function(err){
								if (err) {
									next(err);
								} else {
									res.json({
										result: 1,
										bookInfo: book
									});
								}
							});
						} 
					}
				});
			}
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

	//Check quantity in query
	if (!quantity) {
		quantity = 1;
	}

	//Check quantity in database and removed accordingly
	//If request quantity deleted more than db, it will be removed
	//If quantity is < 1, will be removed 
	BookCollection.findOne(collectionToRemove, function(err, collection){
		if (err) {
			next(err);
		} else {
			if (collection) {
				if (collection.quantity > 1) {
					var checkQuantity = collection.quantity - quantity;

					if (checkQuantity > 0) {
						collection.update({
							$inc: {
								quantity: -quantity
							}
						}, function(err){
							if (err) {
								next(err);
							} else {
								res.json({
									result: 1,
									deleted: quantity
								});
							}
						});
					} else {
						//Show deleted all quantity in database
						collection.remove(function(err){
							if (err) {
								next(err);
							} else{
								res.json({
									result: 1,
									deleted: collection.quantity
								});
							}
						});
					}
				} else {
					collection.remove(function(err){
						if (err) {
							next(err);
						} else{
							res.json({
								result: 1,
								deleted: 1
							});
						}
					});
				}
			} else {
				res.json({
					result: 1,
					deleted: 0
				});
			}
		}
	});
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