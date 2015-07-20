'use strict';

//Setting up route
angular.module('calendaritems').config(['$stateProvider',
	function($stateProvider) {
		// Calendaritems state routing
		$stateProvider.
		state('listCalendaritems', {
			url: '/calendaritems',
			templateUrl: 'modules/calendaritems/views/list-calendaritems.client.view.html'
		}).
		state('createCalendaritem', {
			url: '/calendaritems/create',
			templateUrl: 'modules/calendaritems/views/create-calendaritem.client.view.html'
		}).
		state('viewCalendaritem', {
			url: '/calendaritems/:calendaritemId',
			templateUrl: 'modules/calendaritems/views/view-calendaritem.client.view.html'
		}).
		state('editCalendaritem', {
			url: '/calendaritems/:calendaritemId/edit',
			templateUrl: 'modules/calendaritems/views/edit-calendaritem.client.view.html'
		});
	}
]);