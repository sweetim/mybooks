'use strict';

var myBookController = angular.module('myBookController', []);

myBookController.controller('HomeController', ['$scope', 'UserService', 'CollectionService', function($scope, UserService, CollectionService){
	$scope.user = UserService.getProfile();

	$scope.collectionsInfo = [];
	$scope.bookInfo = {};

	CollectionService.getCollection().then(function(collections){
		collections.forEach(function(book){
			CollectionService.getBook(book.isbn).then(function(bookInfo){
				
				var info = {
					isbn: book.isbn,
					title: bookInfo.title,
					dateCreated: book.dateCreated,
					thumbnail: bookInfo.thumbnail.smallThumbnail,
					quantity: book.quantity,
					isSelected: false
				};

				//Highlight first element
				if ($scope.collectionsInfo.length < 1) {
					info.isSelected = true;
					$scope.bookInfo = bookInfo;
				}

				$scope.collectionsInfo.push(info);
			});
		});
	});

	$scope.getBookInfo = function(isbn){
		CollectionService.getBook(isbn).then(function(bookInfo){
			var info = {
				isbn: bookInfo.isbn,
				title: bookInfo.title,
				subtitle: bookInfo.subtitle,
				pageNumber: bookInfo.pageNumber,
				publisher: bookInfo.publisher,
				publishDate: bookInfo.publishDate,
				author: bookInfo.author,
				description: bookInfo.description,
				thumbnail: bookInfo.thumbnail,
				categories: bookInfo.categories
			};

			//Highlight selected row
			$scope.collectionsInfo.forEach(function(row){
				if (row.isbn === isbn) {
					row.isSelected = true;
				} else {
					row.isSelected = false;
				}
			});

			$scope.bookInfo = info;
		});
	};

	$scope.deleteCollection = function(bookInfo){
		CollectionService.deleteCollection(bookInfo.isbn).then(function(deleted){
			for(var i = 0; i < $scope.collectionsInfo.length; i++){
				if ($scope.collectionsInfo[i].isbn === bookInfo.isbn) {
					if ($scope.collectionsInfo[i].quantity > deleted) {
						$scope.collectionsInfo[i].quantity -= deleted;
					} else {
						$scope.collectionsInfo.splice(i--, 1);
					}
				}
			}
		});
	};
}]);

myBookController.controller('AuthController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
	$scope.login = function(user){
		AuthService.login(user).then(function(user){
			if (user) {
				$location.path('/');
			}
		});
	};

	$scope.logout = function(){
		AuthService.logout();
		$location.path('/login');
	};

	$scope.register = function(newUser){
		AuthService.register(newUser).then(function(user){
			if (user) {
				$location.path('/');
			}
		});
	};
}]);

myBookController.controller('NavController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
	$scope.logout = function(){
		AuthService.logout();
		$location.path('/login');
	};
}]);