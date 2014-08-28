'use strict';

var myBookDirective = angular.module('myBookDirective', []);

myBookDirective.directive('uiToggle', function(){
	return {
		restrict: 'EA', 
		link: function(scope, element, attrs){			
			scope.$watch(attrs.uiToggle, function(val, oldVal){
				if (val !== oldVal) {
					element.removeClass("fadeInRight");
					
					//need refactor code
					//Restart or clone, remove and insert new element(better)
					setTimeout(function(){
						element.addClass("fadeInRight");
					}, 1);
				}
			});
		}
	};
});