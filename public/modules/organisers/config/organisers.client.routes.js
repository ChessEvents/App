'use strict';

//Setting up route
angular.module('organisers').config(['$stateProvider',
	function($stateProvider) {
		// Organisers state routing
		$stateProvider.
		state('listOrganisers', {
			url: '/organisers',
			templateUrl: 'modules/organisers/views/list-organisers.client.view.html'
		}).
		state('createOrganiser', {
			url: '/organisers/create',
			templateUrl: 'modules/organisers/views/create-organiser.client.view.html'
		}).
		state('viewOrganiser', {
			url: '/organisers/:organiserId',
			templateUrl: 'modules/organisers/views/view-organiser.client.view.html'
		}).
		state('editOrganiser', {
			url: '/organisers/:organiserId/edit',
			templateUrl: 'modules/organisers/views/edit-organiser.client.view.html'
		});
	}
]);