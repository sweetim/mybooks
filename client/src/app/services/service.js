'use strict';

var myBookService = angular.module('myBookService', []);

myBookService.factory('AuthService', ['$http', '$q', '$window', function($http, $q, $window){
	return {
		login: function(user){
			var defer = $q.defer();
			$http.post('/auth/login', user)
				.success(function(res){
					if (res.result) {
						$window.localStorage.token = res.token;
						$window.localStorage.user = res.userId;
						defer.resolve(res.userId);
					}
				})
				.error(function(status){
					console.log(status);
				});
			
			return defer.promise;
		},
		logout: function(){
			if ($window.localStorage.token) {
				$window.localStorage.clear();
			}
		},
		register: function(newUser){
			var defer = $q.defer();
			$http.post('/auth/register', newUser)
				.success(function(res){
					if (res.result === 1) {
						$window.localStorage.token = res.token;
						$window.localStorage.user = res.userId;
						defer.resolve(res.userId);
					}
				})
				.error(function(status){
					console.log(status);
				});

			return defer.promise;
		}
	};
}]);

myBookService.factory('UserService', ['$window', function($window){
	return {
		getProfile: function(){
			return $window.localStorage.user;
		}
	};
}]);

myBookService.factory('CollectionService', ['$q', '$http', function($q, $http){
	return {
		getCollection: function(){
			var defer = $q.defer();

			$http.get('/api/collection')
				.success(function(res){

					//Convert to normal date format
					res.collection.forEach(function(data){
						var date = new Date(data.dateCreated);
						data.dateCreated = date.toUTCString();
					});

					defer.resolve(res.collection);
				})
				.error(function(status){
					console.log(status);
				});

			return defer.promise;
		},
		deleteCollection: function(isbn, quantity){
			var defer = $q.defer();
			var url = "";
			
			if (quantity) {
				url = isbn + "?q=" + quantity;
			}

			$http.delete('/api/collection/' + isbn + url)
				.success(function(res){
					defer.resolve(res.deleted);
				})
				.error(function(status){
					console.log(status);
				});

			return defer.promise;
		},
		getBook: function(isbn){
			var defer = $q.defer();

			$http.get('/api/book/' + isbn)
				.success(function(res){
					defer.resolve(res.bookInfo);
				})
				.error(function(status){
					console.log(status);
				});

			return defer.promise;
		}
	};
}]);


myBookService.factory('httpInterceptor', ['$q', '$location', '$window', function($q, $location, $window){
	return {
		'request': function(config){
			//var baseUrl = "http://localhost:3000";
			var baseUrl = "http://mybooks1.herokuapp.com"
			config.url = baseUrl + config.url;

			if ($window.localStorage.token) {
				config.headers.authentication = $window.localStorage.token;
			}

			return config;
		},
		'responseError': function(response){
			var errorCode = response.status;

			switch(errorCode){
				case 401:
					$window.localStorage.clear();
					$location.path('/login');
					break;
				case 500:
					break;
				default:
					$window.localStorage.clear();
					$location.path('/login');
					break;
			}

			return $q.reject(response);
		}
	};
}]);

myBookService.config(['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push('httpInterceptor');
}]);