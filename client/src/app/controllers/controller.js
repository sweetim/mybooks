'use strict';

var myBookController = angular.module('myBookController', []);

myBookController.controller('HomeController', ['$scope', 'UserService', 'CollectionService', function($scope, UserService, CollectionService){
	$scope.user = UserService.getProfile();

	$scope.collectionsInfo = [];
	$scope.bookInfo = {};
	$scope.alertInfo = {
		show: false,
		msg: ""
	};

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

	$scope.fbShareCollection = function(bookInfo){
		FB.api('/me/feed', 'post', {
			message: "I am sharing this book " + bookInfo.title,
			link: "http://mybooks1.herokuapp.com",
			picture: bookInfo.thumbnail.thumbnail,
			name: bookInfo.title,
			caption: bookInfo.subtitle,
			description: bookInfo.description,
			privacy: {
				value: 'SELF'
			}
		}, function(response) {
		    if (!response.error) {
		    	$scope.alertInfo.show = true;
		    	$scope.alertInfo.msg = bookInfo.title + " posted in Facebook!";
		    	$scope.$digest();
		    }
		});
	};
}]);

myBookController.controller('AuthController', ['$scope', '$location', '$window', 'AuthService', function($scope, $location, $window, AuthService){
	$scope.loginLocal = function(user){
		AuthService.login(user).then(function(user){
			if (user) {
				$location.path('/');
			}
		});
	};

	$scope.loginGoogle = function(){

		function signInCallback(authResult){			
			if (authResult.code) {				
				AuthService.loginGoogle(authResult.code).then(function(user){
					if (user) {
						$location.path('/');
					}
				});
			} else {
				//Error login
			}
		}

		gapi.auth.signIn({
			'clientid': '780583752170-0am63sn470uik9bojss4oop0nlk7nu32.apps.googleusercontent.com',
			'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
			'requestvisibleactions': 'http://schema.org/AddAction',
			'cookiepolicy': 'single_host_origin',
			'callback': signInCallback
		});
	};

	$scope.loginFacebook = function(){
		FB.login(function(response){
			switch(response.status){
				case 'connected':
					var token = response.authResponse.accessToken;

					AuthService.loginFacebook(token).then(function(user){
						if (user) {
							$location.path('/');
						}
					});
					break;
				case 'not_authorized':
					break;
				default:
					break;
			}
		}, {
			scope: 'public_profile, email, publish_actions'
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