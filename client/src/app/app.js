'use strict';

var app = angular.module('myBooks', [
	'ngRoute',
	'ngAnimate',
	'myBookController',
	'myBookService',
	'myBookDirective']);

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
	//jshint ignore:start
	//Init Google + SDK	
	(function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/client:plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();

	//Init Facebook SDK
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	//Init Google Analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-49860919-5', 'auto');
	ga('send', 'pageview');
	//jshint ignore:end 

	$window.fbAsyncInit = function(){
		FB.init({
			appId: '825297847502790',
			cookie: true,
			xfbml: true,
			version: 'v2.1'
		});
	};

	$rootScope.$on('$routeChangeStart', function(event, next, current){ //jshint ignore:line
			
		if (next.access && next.access.restricted && !$window.localStorage.token) {
			$location.path('/login');
		}
	});
}]);
