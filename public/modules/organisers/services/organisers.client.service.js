'use strict';

//Organisers service used to communicate Organisers REST endpoints
angular.module('organisers').factory('Organisers', ['$resource',
	function($resource) {
		return $resource('organisers/:organiserId', { organiserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);