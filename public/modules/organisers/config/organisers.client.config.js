'use strict';

// Configuring the Articles module
angular.module('organisers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Organisers', 'organisers', 'dropdown', '/organisers(/create)?');
		Menus.addSubMenuItem('topbar', 'organisers', 'List Organisers', 'organisers');
		Menus.addSubMenuItem('topbar', 'organisers', 'New Organiser', 'organisers/create');
	}
]);