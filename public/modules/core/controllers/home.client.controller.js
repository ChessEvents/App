'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Calendaritems',
	function($scope, Authentication, Calendaritems) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Get a list of calendar items
		$scope.calendaritems = Calendaritems.query();
		
	}
]);