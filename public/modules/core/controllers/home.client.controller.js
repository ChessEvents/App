'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Calendaritems', 'Players',
	function($scope, Authentication, Calendaritems, Players) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Get a list of calendar items
		$scope.calendaritems = Calendaritems.query({ limit: 5 });

		
	}
]);