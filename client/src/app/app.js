'use strict';

var app = angular.module('myBooks', [
	'ngRoute',
	'myBookController',
	'myBookService']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'HomeController',
			templateUrl: '/app/views/home.html',
			access: {
				restricted: true
			}
		})
		.when('/login', {
			controller: 'AuthController',
			templateUrl: '/app/views/login.html',
			access: { 
				restricted: false 
			}
		})
		.when('/register', {
			controller: 'AuthController',
			templateUrl: '/app/views/register.html',
			access: { 
				restricted: false 
			}
		})
		.otherwise({ redirectTo: '/login' });
}]);

app.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
	$rootScope.$on('$routeChangeStart', function(event, next, current){ //jshint ignore:line
			
		if (next.access && next.access.restricted && !$window.localStorage.token) {
			$location.path('/login');
		}
	});
}]);
