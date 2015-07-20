'use strict';

//Calendaritems service used to communicate Calendaritems REST endpoints
angular.module('calendaritems').factory('Calendaritems', ['$resource',
	function($resource) {
		return $resource('calendaritems/:calendaritemId', { calendaritemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);